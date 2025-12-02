const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'users.json');

const readUsers = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users:', error);
  }
};

class Mutex {
  constructor() {
    this.queue = [];
    this.locked = false;
  }

  lock() {
    return new Promise((resolve) => {
      if (this.locked) {
        this.queue.push(resolve);
      } else {
        this.locked = true;
        resolve();
      }
    });
  }

  unlock() {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve();
    } else {
      this.locked = false;
    }
  }
}

const mutex = new Mutex();

const findOrCreateUser = async (profile, provider) => {
  await mutex.lock();
  try {
    const users = readUsers();
    
    let user = users.find(u => u.provider === provider && u.providerId === profile.id);
    
    if (!user) {
      user = {
        id: Date.now().toString(),
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
        username: profile.displayName || profile.username || `${provider}_user_${Date.now()}`,
        provider: provider,
        providerId: profile.id,
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      writeUsers(users);
    }
    
    return user;
  } finally {
    mutex.unlock();
  }
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const users = readUsers();
  const user = users.find(u => u.id === id);
  done(null, user);
});



passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
async (email, password, done) => {
  try {
    const users = readUsers();
    const user = users.find(u => u.email === email && u.provider === 'local');
    
    if (!user) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

const registerUser = async (email, password, username) => {
  await mutex.lock();
  try {
    const users = readUsers();
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: Date.now().toString(),
      email: email,
      username: username || email.split('@')[0],
      password: hashedPassword,
      provider: 'local',
      providerId: null,
      avatar: null,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    writeUsers(users);
    
    return newUser;
  } finally {
    mutex.unlock();
  }
};

module.exports = { passport, registerUser, readUsers };
