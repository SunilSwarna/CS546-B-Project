
const constructorMethod = app => { 


    app.get("/", async (req, res) => {
      try 
      {
          res.render("location", {});
      }
      catch(e) 
      {    
          res.status(404).json({"error": "Couldn't load page"});    
      }
  })
   
    app.use("*", (req, res) => {
      res.status(404).json({"error": "Please Enter a Valid URL"});
    });
  };
  
  module.exports = constructorMethod;