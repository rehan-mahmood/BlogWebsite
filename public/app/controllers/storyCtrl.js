angular.module('storyCtrl', ['storyService'])

.controller('StoryController', function(Story, socketio){

  var vm = this;
  //  Story.allStory()
  Story.all()
  .then(function(data){

    vm.stories = data;
    console.log(data);
  });

  vm.createStory = function(){
    vm.processing = true;
    vm.message = '';
     Story.create(vm.storyData)
     .then(function(data){
       //clear up form
       vm.storyData.content = '';
       vm.message = data.message;


     });
  };

  socketio.on('story', function(data){
     // console.log("i m getting in a problem");
     // console.log(vm.stories)
     // console.log("this is my data");
     // console.log(data);
     vm.stories.data.push(data);
  })


})

.controller('AllStoriesController', function(stories, socketio){
  var vm = this;
  vm.stories = stories.data;

  socketio.on('story', function(data){
  //  console.log(data);
    vm.stories.push(data);
  });
})
