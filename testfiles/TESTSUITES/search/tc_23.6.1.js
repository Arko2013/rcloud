/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showning that For the "Search" results,
 Star is shown for Notebooks with its respective star count


 */

//Begin Tests

casper.test.begin(" Star is shown for Notebooks with its respective star count", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var item = 'inthezoo';
    var title;//get notebook title
    var combo;//store notebook author + title		

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

    //Change the language of prompt cell to Markdown cell. Select 1 for markdown and 2 for python
    casper.then(function () {
        var z = casper.evaluate(function () {
            document.getElementById('insert-cell-language').selectedIndex = 1;
            return true;
        });
    });

    // Getting the title of new Notebook
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("Notebook title : " + title);
        this.wait(2000);
        combo = github_username + ' / ' + title;
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

    //verify if Search results show the star count
    casper.then(function () {
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
            for (var i = 1; i <= counter; i++) {
                this.wait(5000);
                var result = this.fetchText(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ']/tbody/tr/td/a'));
                //this.echo(result);
                if (result == combo) {
                    var star_search = this.fetchText(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ']/tbody/tr/td/i/sub'));
                    var star_notebook = this.fetchText(x('/html/body/div/div/div[2]/ul/li[2]/button/sub/span'));
                    this.test.assertEquals(star_search, star_notebook, "Star in search results displays the respective notebook's star count");
                    break;
                }// if closes
            }//for closes
        });//function closes
    });

    casper.run(function () {
        test.done();
    });
});
