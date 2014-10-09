/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showing that For the "Search" option, the text entered in the text box for 'full-text search'
 will consist of notebook id of the notebook to be searched for, like id: <notebook-ID>

 */

//Begin Tests

casper.test.begin(" Notebook ID for Search", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var item;//item to be searched
    var title;//get notebook title
    var combo;//store notebook author + title	

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
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

    // Getting the title of new Notebook
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo(" New Notebook title : " + title);
        this.wait(2000);
        combo = github_username + ' / ' + title;
    });

    //getting Notebook ID
    var notebookid;
    casper.viewport(1024, 768).then(function () {
        var temp1 = this.getCurrentUrl();
        notebookid = temp1.substring(41);
        this.echo("The Notebook Id: " + notebookid);
        item = "id:" + notebookid;
    });

    //Added a new cell and execute the contents
    functions.addnewcell(casper);

    //Add contents to this cell and then execute it using run option
    casper.viewport(1366, 768).then(function () {
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', "56+87");
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
            this.sendKeys('#input-text-search', item);
            this.wait(6000);
            var z = casper.evaluate(function () {
                $('.icon-search').click();
            });
        });
        var counter = 0;
        casper.wait(5000);
        //counting number of Search results
        casper.then(function () {
            do
            {
                counter = counter + 1;
                this.wait(2000);
            } while (this.visible(x('/html/body/div[3]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + counter + ']/tbody/tr/td/a')));
            counter = counter - 1;
            this.echo("number of search results:" + counter);
        });
        //verify that the searched item is found in the local user's div
        casper.viewport(1366, 768).then(function () {
            //this.echo("Combo= "+combo);
            for (var i = 1; i <= counter; i++) {
                this.wait(5000);
                var result = this.fetchText(x('/html/body/div[3]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ']/tbody/tr/td/a'));
                //this.echo(result);
                this.test.assertEquals(result, combo, 'Notebook with searched id has been found');
                break;

            }//for closes
        });//function closes
    });

    casper.run(function () {
        test.done();
    });
});
