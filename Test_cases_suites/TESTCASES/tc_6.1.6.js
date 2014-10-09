/* 
 Author: Arko
 Description:    This is a casperjs automated test script to delete a comment for the currently loaded notebook
 */

//Begin Tests


casper.test.begin("Delete comment for a notebook", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var title;//get notebook title
    var functions = require(fs.absolute('basicfunctions'));
    var comment = "First comment";//the comment to be entered

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

    //Get notebook title
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("New Notebook title : " + title);
        this.wait(3000);
    });

    //enter the comment
    functions.comments(casper, comment);

    //delete the comment
    casper.then(function () {
        this.click({type: 'css', path: 'i.icon-remove:nth-child(2)'});
        this.wait(4000);
    });

    //verify that when the count is zero
    casper.then(function () {
        var comment_count = this.fetchText({type: 'css', path: '#comment-count'});
        this.test.assertEquals(comment_count, '0', 'Confirmed that the comment has been deleted successfully');
    });

    casper.run(function () {
        test.done();
    });
});
