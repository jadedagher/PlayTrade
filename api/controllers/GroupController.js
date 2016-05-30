/**
 * GroupController
 *
 * @description :: Server-side logic for managing transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  addGroup: function(req, res, next) {

    Group.findOne({
      id : req.params['id']
    }).exec(function foundGroup(err, group) {
      if (err) return next(err);
      if (!group) return next('group doesn t exist');
      group : group


      var addObj = { //on passe les parametres en objet pour la securité
        // Initial Code : Static Team Data
        //team: 'Team'

        // Dynamic Team Management
        team: group.GroupName

      };

      //create the object in the database
      User.update(req.session.User.id, addObj, function UserGroupCreated(err, UserGroup) {

        if (err) {
          return res.send('An error occured to create', 500);
        }
        
        //save it

        //Initial wrong Code
        // res.redirect('/user/Group');

        // New code
        // define/Save the User team in the session Object, used to refresh the page layout
        req.session.User.team = group.GroupName;

      })

      var totalGroupWallet = group.GroupWallet + req.session.User.wallet;
      console.log('TotalGroupWallet' + totalGroupWallet);
      var addWallet = {
        GroupWallet : totalGroupWallet
      };

      Group.update(group, addWallet, function UserGroupUpdated(err, UserGroup) {

        if (err) {
          return res.send('An error occured to create', 500);
        }
        res.redirect('/user/Uteam');
      })


    })

  },

  createGroup: function(req, res, next) {



    var addObjt = { //on passe les parametres en objet pour la securité

      team: req.param('Name')


    };

    //create the object in the database
    User.update(req.session.User.id, addObjt, function UserGroupCreated (err, UserGroup){

      if (err) {
        return res.send('An error occured to create', 500);
      }
      //save it





    });


    var addObj = { //on passe les parametres en objet pour la securité

      GroupName: req.param('Name'),
      GroupWallet : req.session.User.wallet,

    };

    //create the object in the database
    Group.create(addObj, function UserGroupCreated (err, UserGroup){

      if (err) {
        return res.send('An error occured to create', 500);
      }
      //save it


      res.redirect('/user/UTeam');




    });


  }

};

