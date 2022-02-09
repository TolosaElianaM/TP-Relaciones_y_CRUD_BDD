const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const {
    Op
} = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {
                    movies
                })
            })
            .catch(err => {
                console.log(err)
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {
                    movie
                });
            })
            .catch(err => {
                console.log(err)
            })
    },
    'new': (req, res) => {
        db.Movie.findAll({
                order: [
                    ['release_date', 'DESC']
                ],
                limit: 5
            })
            .then(movies => {
                res.render('newestMovies', {
                    movies
                });
            })
            .catch(err => {
                console.log(err)
            })
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
                where: {
                    rating: {
                        [db.Sequelize.Op.gte]: 8
                    }
                },
                order: [
                    ['rating', 'DESC']
                ]
            })
            .then(movies => {
                res.render('recommendedMovies.ejs', {
                    movies
                });
            })
            .catch(err => {
                console.log(err)
            })
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {

        db.Genre.findAll()
            .then(genres => {
                res.render('moviesAdd', {
                    allGenres: genres
                })
            })
            .catch(err => {
                console.log(err)
            })


    },
    create: function (req, res) {
        db.Movie.create(req.body)
            .then(result => {
                res.redirect(`/movies/detail/${result.id}`)
            })
            .catch(err => {
                console.log(err)
            })
    },
    edit: async function (req, res) {

        try {

            const Movie = await db.Movie.findOne({
                where: {
                    id: +req.params.id
                },
                include: [{
                    association: 'genre'
                }]
            })

            const allGenres = await db.Genre.findAll()

            res.render('moviesEdit', {
                Movie,
                allGenres
            })

        } catch (error) {
            res.send(error)
        }
    },
    update: function (req, res) {

    },
    delete: function (req, res) {

    },
    destroy: function (req, res) {

    }
}

module.exports = moviesController;