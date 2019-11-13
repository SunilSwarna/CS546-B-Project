const locationRoutes =require('./location')

const constructorMethod = app => { 


    app.use("/", locationRoutes) 
   
    app.use("*", (req, res) => {
      res.status(404).json({"error": "Please Enter a Valid URL"});
    });
  };
  
  module.exports = constructorMethod;