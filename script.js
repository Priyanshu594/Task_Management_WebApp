const state={
    taskList: [], //to store the tasks, here objesct state is created so that we could also store other things here in future
}

//DOM manupulation
const taskContent=document.querySelector(".task_content");//to store/accesing the content
const taskModal=document.querySelector(".task_modal_body");//to open pop ups for editing nd deleting

//below we are creating inner html that will add the task to our page body
//inner html ends up in html file nd hence all the attached file in main html body works in inner html as well
const htmlTaskContent = ({ id, title, description, type, url}) => ` 
<div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
<div class='card shadow-sm task_card'>
<div class='card-header d-flex gap-2 justify-content-end task_card_header' >

<button type='button' class='btn btn-outline-info mr-2'  name=${id} onclick="editTask.apply(this, arguments)">
Edit
</button>

<button type='button' class='btn btn-outline-danger mr-2' onclick="deleteTask.apply(this, arguments)" name=${id}>Delete
</button>
</div>
 <div class='card-body'>
    ${
        url?
        `<img width='100%' src=${url} alt='card image cap' class='img-fluid place_holder_image mb-3' style="height: 40vh"/>`
        : `
        <img width='100%' src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='' class='img-fluid place_holder_image mb-3' style="height: 40vh"/>
        `
    }
    <h4 class='task_card_title'>${title}</h4>
    <p class='Description trim-3-lines text-muted' data_gram_editor='false' >${description}</p>
    <div class='tags text-white d-flex flex-wrap'>
    <span class='badge bg-primary m-1'>${type}</span>
 </div>
 <div class='card-footer'>
 <button
 type='button'
 class='btn btn-outline-primary float-right'
 data-bs-toggle='modal'
 data-bs-target='#showTask'
 id=${id}
 onclick='openTask.apply(this, arguments)';
 >
 Open Task
 </button>
 </div>
</div>
</div>
</div>
`;

const htmlModalContent = ({id, title, description, url})=> {
    const date = new Date(parseInt(id));
    return `
    <div id=${id}>
    ${
        url?
        `<img width='100%' src=${url} alt='card image cap' class='img-fluid place_holder_image mb-3'/>`
        : `
        <img width='100%' src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='' class='img-fluid place_holder_image mb-3' style="height: 70vh"/>
        `

    }
    <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
    <h2 class='my-3'>${title}</h2>
    <p class='lead'>
    ${description}
    </p>
    </div>
    `;
};

const updateLocalStorage = () => {
    console.log(state.taskList);
    localStorage.setItem("tasks",JSON.stringify({
        tasks: state.taskList,
    })
   
    );
};

const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.tasks);

    if (localStorageCopy) state.taskList = localStorageCopy.tasks;

    state.taskList.map((cardDate) => {
        taskContent.insertAdjacentHTML("beforeend",htmlTaskContent(cardDate));

    });
};

const handleSubmit = (event) => {
    const id= `${Date.now()}`;
    const input = {
        url: document.getElementById("imageurl").value,
        title: document.getElementById("taskTitle").value,
        description: document.getElementById("taskDesription").value,
        type: document.getElementById("tags").value,
      };
      

    if(input.title === '' || input.description === '' || input.type === '')
    { let alertre= alert("Fill all the fields")
    return alertre;
     
};
    
      taskContent.insertAdjacentHTML(
        "beforeend", 
        htmlTaskContent({
            ...input,
            id,
        })
      );

      state.taskList.push({...input, id});
      updateLocalStorage();
      
    
};


const openTask = (e)=>{
    if(!e) e= window.Event;

    const getTask = state.taskList.find(({id})=> id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);

};


const deleteTask = (e) =>{
    if(!e) { e=window.event};
    const targetID = e.target.getAttribute("name");
    const type = e.target.tagName;
    const removeTask = state.taskList.filter(({id})=> id !== targetID);
    state.taskList = removeTask;
    

    
    if(type === "BUTTON"){
        e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    }

    else{
    e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
    );
}
updateLocalStorage();
};



const editTask = (e) => {
    if(!e){e=window.Event};

    const targetID = e.target.id;
    const type= e.target.tagname;

    let parentNode;
    let taskTitle;
    let taskDesription;
    let taskType;
    let submitButton;

        parentNode = e.target.parentNode.parentNode;

    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDesription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[3].childNodes[9].childNodes[1];
    console.log(submitButton);
    taskTitle.setAttribute("contenteditable","true");
    taskDesription.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");

    submitButton.setAttribute("onclick","saveEdit.apply(this, arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML="Save Changes";
  };


  const saveEdit = (e) => {
    if(!e) e=window.event;

    const targetID = e.target.id;
    const type = e.target.tagname;
    const parentNode = e.target.parentNode.parentNode.parentNode;
  
    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription=parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[3].childNodes[9].childNodes[1];

    const updateData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };

    // console.log(updateData);

    let stateCopy = state.taskList;
    // console.log(stateCopy);
    
  
    stateCopy = stateCopy.map((task)=>
     (task.id === targetID)
     ?
      {
        id: task.id,
        title: updateData.taskTitle,
        description: updateData.taskDescription,
        type: updateData.taskType,
        url: task.url,
    } : task
    
    ) ;

    // console.log(stateCopy);


       state.taskList = stateCopy;
    //    console.log(state.taskList);
  
    updateLocalStorage();
    // console.log(state.taskList);
  
    taskTitle.setAttribute("contenteditable","false");
    taskDescription.setAttribute("contenteditable","false");
    taskType.setAttribute("contenteditable","false");

    submitButton.setAttribute("onclick","openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle","modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML="Open Task";


  };

  const searchTask = (e) => {
    if(!e){
        e= window.event;
    }

    while (taskContent.firstChild) {
        taskContent.removeChild(taskContent.firstChild);
    }

    const resultData = state.taskList.filter(({title})=>{
        return title.toLowerCase().includes(e.target.value.toLowerCase());
    });

    console.log(resultData);

    resultData.map((cardData)=>{
        taskContent.insertAdjacentHTML("beforeend",htmlTaskContent(cardData));
    });
  };