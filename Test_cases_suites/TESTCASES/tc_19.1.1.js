/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showning that For the "Search" option, the text entered in the text box for
 'full-text search' will consist of  Notebook Description like Notebook 1 etc. only


 */

//Begin Tests

casper.test.begin("  Notebook Description as Search Text", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('/home/arko/Downloads/SLIMER-CASPER/casperjs/testsuites/basicfunctions'));
    var item = '"2345676"';//item to be searched
    var title;//get notebook title
    var combo;//store notebook author + title	
    var newtitle;//get modified notebook title
    var newcombo;//store modified notebook author + title	

    casper.start(rcloud_url, function () {
        casper.page.injectJs('/home/arko/Downloads/SLIMER-CASPER/casperjs/jquery-1.10.2.js');
    });
    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);

    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    //Edit the notebook title
    casper.viewport(1024, 768).then(function () {
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("NewNotebook");
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;
            jQuery("#notebook-title").trigger(e);
            return true;
        });
        this.reload();
        this.wait(7000);
    });

    // Getting the title of new Notebook
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("Notebook title : " + title);
        this.wait(2000);
        combo = github_username + ' / ' + title;
    });

    //getting Notebook ID
    var notebookid;
    casper.viewport(1024, 768).then(function () {
        var temp1 = this.getCurrentUrl();
        notebookid = temp1.substring(41);
        this.echo("The Notebook Id: " + notebookid);

    });

    //Added a new cell and execute the contents
    functions.addnewcell(casper);

    //Add contents to this cell and then execute it using run option
    casper.viewport(1366, 768).then(function () {
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', item);
        this.wait(3000);
        this.click({type: 'css', path: 'div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > td:nth-child(3) > span:nth-child(1) > i:nth-child(1)'});//css for executing the contents
        this.echo("executed contents of First cell");
        this.wait(6000);
    });

    //function to search the entered item
    casper.viewport(1024, 768).then(function () {
        if (this.visible('#search-form')) {
            console.log('Search div is already opened');
        }
        else {
            var z = casper.evaluate(function () {
                $('.icon-search').click();
            });
            this.echo("Opened Search div");
        }
        //entering item to be searched
        casper.then(function () {
            this.sendKeys('#input-text-search', notebookid);
            this.wait(6000);
            this.click({type: 'css', path: '#search-form > button:nth-child(2)'});
        });
        var counter = 0;
        casper.wait(5000);
        //counting number of Search results
        casper.then(function () {
            do
            {
                counter = counter + 1;
                this.wait(2000);
            } while (this.visible(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + counter + ']/tbody/tr/td/a')));
            counter = counter - 1;
            this.echo("number of search results:" + counter);
        });
        //verify that the searched item is found in the local user's div
        casper.viewport(1366, 768).then(function () {
            //this.echo("Combo= "+combo);
            for (var i = 1; i <= counter; i++) {
                this.wait(5000);
                var result = this.fetchText(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ']/tbody/tr/td/a'));
                //this.echo(result);
                this.test.assertEquals(result, combo, 'Notebook with Searched title has been found');
                break;

            }//for closes
        });//function closes
    });

    //Edit the notebook title again
    casper.viewport(1024, 768).then(function () {
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("ModifiedNotebook");
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;
            jQuery("#notebook-title").trigger(e);
            return true;
        });
        this.reload();
        this.wait(7000);
    });

    // Getting the title of new Notebook
    casper.then(function () {
        newtitle = functions.notebookname(casper);
        this.echo("Notebook title : " + newtitle);
        this.wait(2000);
        newcombo = github_username + ' / ' + newtitle;
    });

    //function to search the entered item
    casper.viewport(1024, 768).then(function () {
        if (this.visible('#search-form')) {
            console.log('Search div is already opened');
        }
        else {
            var z = casper.evaluate(function () {
                $('.icon-search').click();
            });
            this.echo("Opened Search div");
        }
        //entering item to be searched
        casper.then(function () {
            this.sendKeys('#input-text-search', notebookid);
            this.wait(6000);
            this.click({type: 'css', path: '#search-form > button:nth-child(2)'});
        });
        var counter = 0;
        casper.wait(5000);
        //counting number of Search results
        casper.then(function () {
            do
            {
                counter = counter + 1;
                this.wait(2000);
            } while (this.visible(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + counter + ']/tbody/tr/td/a')));
            counter = counter - 1;
            this.echo("number of search results:" + counter);
        });
        //verify that the searched item is found in the local user's div
        casper.viewport(1366, 768).then(function () {
            //this.echo("Combo= "+combo);
            for (var i = 1; i <= counter; i++) {
                this.wait(5000);
                var result = this.fetchText(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ']/tbody/tr/td/a'));
                //this.echo(result);
                this.test.assertEquals(result, newcombo, 'Notebook has been found after modifying Notebook description');
                break;

            }//for closes
        });//function closes
    });


    casper.run(function () {
        test.done();
    });
});
