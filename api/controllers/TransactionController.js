/**
 * TransactionController
 *
 * @description :: Server-side logic for managing transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  buy: function(req, res, next) {


    var http = require('http');

    //AJAX request google server
    http.get({

        //URL to access to data
        host: 'www.google.com',
        port: 80,
        //ticker -> symbol of the company
        path: '/finance/info?client=ig&q='+req.param('ticker') //ticker-> YAHOO
      },
      function(response) {

        //encode the response utf8
        response.setEncoding('utf8');
        var data = "";

        response.on('data', function(chunk) {
          data += chunk;
        });

        response.on('end', function() {
          if (data.length > 0) {

            try {
              //parse JSON
              var data_object = JSON.parse(data.substring(3));
            } catch (e) {
              return;
            }
            //put the data in the list
            var quote = {};
            quote.ticker = data_object[0].t;
            quote.price = data_object[0].l_cur;
            quote.last_trade_time = data_object[0].lt;

            //server side
            console.log("get_quote function test: the price of the " + quote.ticker + " quote: " + quote.price + " USD at "+quote.last_trade_time);


            //arrondire et afficher avec numeraljs
            var numeral = require('numeral');

            var total = req.param('volume')*quote.price;
            //typeof 'totalArrondi' = number
            var totalArrondi = total.toFixed(2);

            //typeof 'totalArrondi_numeral' = string
            //numeral convert a number to a string
            var totalArrondi_numeral = numeral(totalArrondi).format('0,0[.]00 $');



            var transactionBUYObj = { //on passe les parametres en objet pour la securité

              type: "Buy",
              authorId: req.session.User.pseudo,
              date: quote.last_trade_time,
              symbol: quote.ticker,
              volume: req.param('volume'),
              price: quote.price,

              //typeof 'totalArrondi_numeral' = string
              total: totalArrondi_numeral

            };

            //create the object in the database
            Transaction.create(transactionBUYObj, function transactionBUYCreated (err, transactionBUY){

              if (err) {
                return res.send('An error occured to create', 500);
              }
              //save it
              transactionBUY.save(function(err, transactionBUY) {
                if (err) {
                  return res.send('An error occured to save', 500);
                }

                res.redirect('/user/transaction_panel');

              });

            });


            //deformater la variable 'totalArrondi_numeral' qui était de type 'string' en 'number'
            //pour la soutraire avec notre "wallet" qui est un 'number'
            var unformat_totalArrondi_numeral = numeral().unformat(totalArrondi_numeral);

            //arrondit le wallet
            /*
              Problem Is here
              you work on req.session.user.wallet , But this object was initialized at the first connexion of user
              It does not take into account the modification done on teh DB
              --> you should refresh you wallet value (get it from the DB)
             */

            /*
             * Calling the function getWalletByUser
             */
            getWalletByUser(unformat_totalArrondi_numeral, req, res);
            getWalletByGroupBUY(unformat_totalArrondi_numeral, req, res);
            //console.log(selectedUser);

            // /var walletFromDB = selectedUser.wallet;

            /* comment code 1
            // erroris here !
            var totalWallet = req.session.User.wallet - unformat_totalArrondi_numeral;
            //var totalWallet = walletFromDB - unformat_totalArrondi_numeral;
            var totalWallet_arrondi = totalWallet.toFixed(2);


            console.log('Etape 3: affiche wallet');
            //console.log(walletFromDB);
            console.log(unformat_totalArrondi_numeral);
            console.log(totalWallet_arrondi);

            var walletObj = {
              //typeof 'unformat_totalArrondi_numeral' = number
              wallet: totalWallet_arrondi
            }

*/
            /*
             * The problem causing the update of all users --> you passed an undefined value (req.param('id'))
             * you should pass the correct ID of user ::  req.session.User.id
             */
            //User.update(req.param('id') , walletObj, function walletUptated(err) {

            /* comment code 2
            User.update(req.session.User.id, walletObj, function walletUptated(err) {
               //console.log('id:='+req.param('id') )    ;
               console.log(req.session.User.id);

              console.log('Etape 5: update')

              if (err) {
                return res.send('An error occured to update user wallet', 500);
              }

            });
            */

          }
        });
      });

  },




  sell: function(req, res, next) {

    var numeral = require('numeral');

    Transaction.findOne({
        id: req.params['id']
      })
      .exec(function foundtransaction(err, transaction) {

        if (err) return next(err);
        if (!transaction) return next('transaction doesn\'t exist.');
        transaction : transaction

        var transactionBuyPrice = transaction.price;
        var VolumeOfTransactionId = transaction.volume;
        var totalOfPassTransactionId = transaction.total;
        var TickerTransactionId = transaction.symbol;

        // +++++++++++++++++++++++++++++++++++++++++++

        var http = require('http');

        //AJAX request google server
        http.get({

            //URL to access to data
            host: 'www.google.com',
            port: 80,
            //ticker -> symbol of the company
            path: '/finance/info?client=ig&q='+TickerTransactionId //ticker-> YAHOO
          },
          function(response) {

            //encode the response utf8
            response.setEncoding('utf8');
            var data = "";

            response.on('data', function(chunk) {
              data += chunk;
            });

            response.on('end', function() {
              if (data.length > 0) {

                try {
                  //parse JSON
                  var data_object = JSON.parse(data.substring(3));
                } catch (e) {
                  return;
                }
                //put the data in the list
                var quoteSell = {};
                quoteSell.ticker = data_object[0].t;
                quoteSell.price = data_object[0].l_cur;
                quoteSell.last_trade_time = data_object[0].lt;

                console.log("To sell: the price of the " + quoteSell.ticker + " quote: " + quoteSell.price + " USD at "+quoteSell.last_trade_time);

                //on calcule le prix total de la transaction
                var totalToSell = VolumeOfTransactionId*quoteSell.price;
                //on calcule arrondi le prix total de la transaction à deux chiffres après la virgule
                var totalArrondiToSell = totalToSell.toFixed(2);


                //transactionBuy.price = prix de l'action lors de la transaction Passé
                //quoteSell.price = prix de l'action lors de la transaction actuel

                //condition pour tester si l'utilisateur a fait un profit ou un debit


                if(quoteSell.price < transactionBuyPrice){//PERTE

                  //fonction qui decremente le user.wallet avec le difference des deux prix transaction
                  console.log("PERTE");

                  //on deformat le totalOfPassTransactionId qui est en 'string' pour le mettre en 'number'
                  var unformat_totalOfPassTransactionId_numeral_PERTE = numeral().unformat(totalOfPassTransactionId);


                  //on calcul la difference entre l'ancien total et le nouveau pour avoir la PERTE
                  var differencePerte = unformat_totalOfPassTransactionId_numeral_PERTE - totalArrondiToSell;
                  //on arrondit les pertes
                  var differencePerteArrondi= differencePerte.toFixed(2);



                  //total de la transaction avec pertes comprisent
                  var total = totalToSell - differencePerte;


                  getWalletByUserToSellPerte(total, req, res);
                  getWalletByGroupSELL(total, req, res);

                        var transactionSell = {
                          type: "Sell",
                          date: quoteSell.last_trade_time,
                          perte: differencePerteArrondi,
                          //total: totalNumeral

                        }

                        Transaction.update(req.param('id'),transactionSell, function transactionSell(err) {
                          if (err) return next(err);
                        });

                        res.redirect('/user/transaction_panel');



                }else if(quoteSell.price > transactionBuyPrice){//PROFIT
                  //fonction qui incremente le user.wallet avec la difference des deux prix transaction

                  console.log("Profit");

                  //on deformat le totalOfPassTransactionId qui est en 'string' pour le mettre en 'number'
                  var unformat_totalOfPassTransactionId_numeral_PROFIT = numeral().unformat(totalOfPassTransactionId);
                  //on calcul la difference entre l'ancien total est l'ancien
                  var differenceProfit = totalArrondiToSell - unformat_totalOfPassTransactionId_numeral_PROFIT;

                  //Arrondir
                  var differenceProfitArrondi= differenceProfit.toFixed(2);


                  //total de la transaction avec profit comprit
                  var total = totalToSell + differenceProfitArrondi;


                  getWalletByUserToSellProfit(total, req, res);
                  getWalletByGroupSELL(total, req, res);

                        var transactionSell = {
                          type: "Sell",
                          date: quoteSell.last_trade_time,
                          profit: differenceProfitArrondi

                        }

                        Transaction.update(req.param('id'),transactionSell, function transactionSell(err) {
                          if (err) return next(err);
                        });

                        res.redirect('/user/transaction_panel');




                }else{//quote.price = transactionBuy.price
                  //fonction qui incremente le user.wallet avec le prix exact de la transaction passé
                  //ni de GAIN ni de PERTE

                  console.log("c'est ni de GAIN ni de PERTE");

                  //on deformat le totalOfPassTransactionId qui est en 'string' pour le mettre en 'number'
                  var unformat_totalOfPassTransactionId_numeral_NULL = numeral().unformat(totalOfPassTransactionId);
                  //on affecte l'ancienne valeur total à difference NULL
                  var differenceNull = unformat_totalOfPassTransactionId_numeral_NULL;

                  getWalletByUserToSellNULL(differenceNull, req, res);
                  getWalletByGroupSELL(differenceNull, req, res);

                        var transactionSell = {
                          type: "Sell",
                          date: quoteSell.last_trade_time,
                          profit: "No profit",
                          perte: "No loss"
                        }

                        Transaction.update(req.param('id'),transactionSell, function transactionSell(err) {
                          if (err) return next(err);
                        });

                        res.redirect('/user/transaction_panel');


                }//end condition
              }
            });
          });//end AJAX request
      });//end .exe
  }//end sell

};//end module export






/*
 * Adding a test function to get updated from DB
 *  the error management is missing !!!
 *  It should be in the exports module in the UserController!!!
 *  It is not too clean , normally we use the variable req.params.id --> but here it is not defined !
 */

// ++++++++++++++++++"BUY" function+++++++++++++++++++
var getWalletByUser = function(unformatArrondi, req, res, next) {
  
  User.findOne({
      id: req.session.User.id
    })
    .exec(function sltWalletValue(err, sltuser) {
      if (err) return next(err);
      if (!sltuser) return next();
      sltuser: sltuser

      /*
       * You code
       */
      // error on the (req.session.User.wallet)
      //var totalWallet = req.session.User.wallet - unformat_totalArrondi_numeral;
      var totalWalletBUY = sltuser.wallet - unformatArrondi;
      var totalWalletBUY_arrondi = totalWalletBUY.toFixed(2);


      var walletObj = {
        //typeof 'unformat_totalArrondi_numeral' = number
        wallet: totalWalletBUY_arrondi
      }

      /*
       * your code : User.update(req.param('id'),  walletObj, function walletUptated(err)
       * error: req.parm('id' : undefined object
       */
      User.update(req.session.User.id, walletObj, function walletUptated(err) {
        //console.log('id:='+req.param('id') )    ;

        if (err) {
          return res.send('An error occured to update user wallet', 500);
        }

      });



    });
}
exports.getWalletByUser= getWalletByUser;


// ++++++++++++++++++"SELL" function+++++++++++++++++++


// ++++++++++++++++++Gain+++++++++++++++++++

var getWalletByUserToSellProfit = function(differenceProfit, req, res, next) {

  User.findOne({
      id: req.session.User.id
    })
    .exec(function sltWalletValue(err, sltuser) {
      if (err) return next(err);
      if (!sltuser) return next();
      sltuser: sltuser


      var totalWalletProfit = sltuser.wallet + differenceProfit;//Gain
      var totalWallet_arrondi_profit = parseFloat(totalWalletProfit).toFixed(2);


      var walletObj = {

        wallet: totalWallet_arrondi_profit
      }

      User.update(req.session.User.id, walletObj, function walletUptated(err) {

        if (err) {
          return res.send('An error occured to update user wallet', 500);
        }

      });



    });
}
exports.getWalletByUserToSellProfit= getWalletByUserToSellProfit;

// ++++++++++++++++++PERTE+++++++++++++++++++

var getWalletByUserToSellPerte = function(differencePerte, req, res, next) {

  User.findOne({
      id: req.session.User.id
    })
    .exec(function sltWalletValue(err, sltuser) {
      if (err) return next(err);
      if (!sltuser) return next();
      sltuser: sltuser


      var totalWalletPerte = sltuser.wallet + differencePerte;//Perte
      var totalWallet_arrondi_perte = totalWalletPerte.toFixed(2);


      var walletObj = {

        wallet: totalWallet_arrondi_perte
      }

      User.update(req.session.User.id, walletObj, function walletUptated(err) {

        if (err) {
          return res.send('An error occured to update user wallet', 500);
        }

      });



    });
}
exports.getWalletByUserToSellPerte= getWalletByUserToSellPerte;

// ++++++++++++++++++NULL+++++++++++++++++++

var getWalletByUserToSellNULL = function(differenceNull, req, res, next) {

  User.findOne({
      id: req.session.User.id
    })
    .exec(function sltWalletValue(err, sltuser) {
      if (err) return next(err);
      if (!sltuser) return next();
      sltuser: sltuser


      var totalWalletNULL = sltuser.wallet + differenceNull;//pas de Perte ni de Profit //differenceNull = totalOfPassTransactionId
      var totalWallet_arrondi_NULL = totalWalletNULL.toFixed(2);


      var walletObj = {

        wallet: totalWallet_arrondi_NULL
      }

      User.update(req.session.User.id, walletObj, function walletUptated(err) {

        if (err) {
          return res.send('An error occured to update user wallet', 500);
        }

      });



    });
}
exports.getWalletByUserToSellNULL= getWalletByUserToSellNULL;


//group

var getWalletByGroupBUY = function(unformatArrondi, req, res, next) {
  console.log('my function :='+ 'wallettt?????');
  Group.findOne({
      GroupName: req.session.User.team
    })
    .exec(function foundGroup(err, group) {
      if (err) return next(err);
      if (!group) return next('group doesn t exist');
      group : group


      /*
       * You code
       */
      // error on the (req.session.User.wallet)
      //var totalWallet = req.session.User.wallet - unformat_totalArrondi_numeral;
      var totalWallet = group.GroupWallet - unformatArrondi;
      var totalWallet_arrondi = totalWallet.toFixed(2);


      console.log('Etape 3: affiche wallet');
      //console.log(walletFromDB);
      console.log(unformatArrondi);
      console.log(totalWallet_arrondi);

      var walletObj = {
        //typeof 'unformat_totalArrondi_numeral' = number
        GroupWallet: totalWallet_arrondi
      }

      var totalGroupWallet = group.GroupWallet - unformatArrondi;
      console.log('TotalGroupWallet' + totalGroupWallet);
      var addGroupWallet = {
        GroupWallet : totalGroupWallet
      };

      Group.update(group, addGroupWallet, function UserGroupUpdated(err) {

        if (err) {
          return res.send('An error occured to create', 500);
        }

      })


    });
}
exports.getWalletByGroupBUY= getWalletByGroupBUY;


var getWalletByGroupSELL = function(unformatArrondi, req, res, next) {
  console.log('my function :='+ 'wallettt?????');
  Group.findOne({
      GroupName: req.session.User.team
    })
    .exec(function foundGroup(err, group) {
      if (err) return next(err);
      if (!group) return next('group doesn t exist');
      group : group


      /*
       * You code
       */
      // error on the (req.session.User.wallet)
      //var totalWallet = req.session.User.wallet - unformat_totalArrondi_numeral;
      var totalWallet = group.GroupWallet - unformatArrondi;
      var totalWallet_arrondi = totalWallet.toFixed(2);


      console.log('Etape 3: affiche wallet');
      //console.log(walletFromDB);
      console.log(unformatArrondi);
      console.log(totalWallet_arrondi);

      var walletObj = {
        //typeof 'unformat_totalArrondi_numeral' = number
        GroupWallet: totalWallet_arrondi
      }

      var totalGroupWallet = group.GroupWallet + unformatArrondi;
      console.log('TotalGroupWallet' + totalGroupWallet);
      var addGroupWallet = {
        GroupWallet : totalGroupWallet
      };

      Group.update(group, addGroupWallet, function UserGroupUpdated(err) {

        if (err) {
          return res.send('An error occured to create', 500);
        }

      })


    });
}
exports.getWalletByGroupSELL= getWalletByGroupSELL;
