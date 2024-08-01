require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: false
  }
});

const Theme = sequelize.define('Theme', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING
});

const Set = sequelize.define('Set', {
  set_num: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING,
  year: Sequelize.INTEGER,
  num_parts: Sequelize.INTEGER,
  theme_id: Sequelize.INTEGER,
  img_url: Sequelize.STRING
});

Set.belongsTo(Theme, { foreignKey: 'theme_id' });

function initialize() {
  return sequelize.sync()
    .then(() => Promise.resolve())
    .catch(err => Promise.reject(err));
}

function getAllSets() {
  return Set.findAll({ include: [Theme] })
    .then(sets => Promise.resolve(sets))
    .catch(err => Promise.reject(err));
}

function getSetByNum(setNum) {
  return Set.findAll({
    where: { set_num: setNum },
    include: [Theme]
  })
    .then(set => Promise.resolve(set[0] || null))
    .catch(err => Promise.reject("Unable to find requested set"));
}

function getSetsByTheme(theme) {
  return Set.findAll({
    include: [Theme],
    where: {
      '$Theme.name$': {
        [Sequelize.Op.iLike]: `%${theme}%`
      }
    }
  })
    .then(sets => Promise.resolve(sets))
    .catch(err => Promise.reject("Unable to find requested sets"));
}

function addSet(setData) {
  return Set.create(setData)
    .then(() => Promise.resolve())
    .catch(err => Promise.reject(err.errors[0].message));
}

function updateSet(setData) {
  return Set.update(setData, { where: { set_num: setData.set_num } })
    .then(() => Promise.resolve())
    .catch(err => Promise.reject(err.errors[0].message));
}

function deleteSet(setNum) {
  return Set.destroy({ where: { set_num: setNum } })
    .then(() => Promise.resolve())
    .catch(err => Promise.reject(err));
}

function getAllThemes() {
  return Theme.findAll()
    .then(themes => Promise.resolve(themes))
    .catch(err => Promise.reject(err));
}

const bulkInsertData = {
  themes: [
    { name: 'City' },
    { name: 'Star Wars' },
    { name: 'Harry Potter' }
  ],
  sets: [
    {
      set_num: '60262',
      name: 'Passenger Airplane',
      year: 2020,
      num_parts: 669,
      theme_id: 1,
      img_url: 'https://example.com/60262.jpg'
    },
    {
      set_num: '75257',
      name: 'Millennium Falcon',
      year: 2019,
      num_parts: 1351,
      theme_id: 2,
      img_url: 'https://example.com/75257.jpg'
    }
  ]
};

sequelize.sync({ force: true }).then(() => {
  Theme.bulkCreate(bulkInsertData.themes).then(() => {
    Set.bulkCreate(bulkInsertData.sets).then(() => {
      console.log("Data inserted successfully.");
    });
  });
});

module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  addSet,
  updateSet,
  deleteSet,
  getAllThemes
};
