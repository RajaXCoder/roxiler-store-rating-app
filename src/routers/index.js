module.exports = function(app) {
    require('./auth.routes')(app);
    require('./user.routes')(app);
    require('./store.routes')(app);
    require('./rating.routes')(app);
    
    // Handle 404
    app.use(function(req, res) {
      res.status(404).json({
        success: false,
        message: "Route not found"
      });
    });
  };