var server = require('../app').server;
var chai = require('chai');
var phantom = require('phantom');

var should = chai.should();

describe('App Integration', function() {
    var sitepage = null;
    var phInstance = null;
    var page = null;
    var app = null;
    var catchFunction = function(err) {
        console.log(err);
        phInstance.exit();
        server.close();
    };

    // setup the phantom site and load the server's url.
    before(function(done) {
        phantom.create().then(function(instance) {
            phInstance = instance;
            return instance.createPage();
        }).then(function(localPage) {
            page = localPage;
            app = page.open('http://localhost:81').catch(catchFunction);
            done();
        }).catch(catchFunction);
    });

    after(function() {
        phInstance.exit();
    });

    describe('Test Load in headless mode', function() {
        // confirm the server is up and running
        it('Check TodoList Title', function(done) {
            app.then(function(res) {
                page.evaluate(function() {
                    return document.title;
                }).then(function(res) {
                    res.should.be.equal('My todolist');
                    done();
                }).catch(catchFunction);
            });
        });
    });

    describe('Add new ToDo Item', function() {
       // do the actual add
        before(function(done) {
            app.then(function(res) {
                page.evaluate(function() {
                    document.getElementById('newtodo').value = "Test: To Do Created";
                    document.getElementById('new-submit').click();
                }).then(function() {
                    done();
                }).catch(catchFunction);
            });
        });

        // check to see if value has been added
        it('should see new ToDo item', function(done) {
            app.then(function(res) {
                page.evaluate(function() {
                    currentIndex=document.querySelectorAll(".toDovalue").length-1;
                    return document.getElementById('span-todo-' + currentIndex).innerHTML;
                }).then(function(res) {
                    res.should.be.equal("Test: To Do Created");
                    done();
                }).catch(catchFunction);
            });
        });
    });

    describe('Edit ToDo Item', function() {
        // do the actual update
        before(function(done) {
            app.then(function(res) {
                page.evaluate(function() {
                    currentIndex=document.querySelectorAll(".toDovalue").length-1;
                    document.getElementById('edittodo-' + currentIndex).value = 'Test: To Do Has Been Updated';
                    document.getElementById('edit-submit-'+ currentIndex).click();
                }).then(function() {
                    done();
                }).catch(catchFunction);
            });
        });

        // do the assertion
        it('should see updated ToDo item', function(done) {
            app.then(function(res) {
                page.evaluate(function() {
                    currentIndex=document.querySelectorAll(".toDovalue").length-1;
                    return document.getElementById('span-todo-' + currentIndex).innerHTML
                }).then(function(res) {
                    // console.log(res);
                    res.should.be.equal('Test: To Do Has Been Updated');
                    done();
                }).catch(catchFunction);
            });
        });
    });

    describe('Delete ToDo Item', function() {
        before(function(done) {
            app.then(function(res) {
                page.evaluate(function() {
                    currentIndex=document.querySelectorAll(".toDovalue").length-1;
                    document.getElementById('delete-submit-'+ currentIndex).click();
                }).then(function() {
                    done();
                }).catch(catchFunction);
            });
        });

        // do the assertion
        it('should not see the ToDo item', function(done) {
            app.then(function(res) {
                page.evaluate(function() {
                    var input=document.querySelectorAll(".toDovalue");
                    if(input)
                    {
                        var item=document.getElementById('span-todo-' + input.length-1);
                        if(item)
                        {
                            return item.innerHTML;
                        }
                    }
                    return 'No rows present in collection,test also passed.';
                }).then(function(res) {
                    res.should.not.be.equal('Test: To Do Has Been Updated');
                    done();
                }).catch(catchFunction);
            });
        });
    });
});
