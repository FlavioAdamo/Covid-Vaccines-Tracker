
var listOfContributors = [];

async function setList() {
    const {data} = await getListOfContributors()
    listOfContributors = data;
    console.log(listOfContributors);
    displayList(listOfContributors);
}


async function getListOfContributors() {
    return await axios.get(
        'https://api.github.com/repos/FlavioAdamo/Covid-Vaccines-Tracker/contributors'
    );
    
}

async function displayList(listOfContributors){
    for (let i = 0; i < listOfContributors.length; i++) {
        const data = listOfContributors[i];
        const avatar = data.avatar_url;
        const url = data.html_url;
        const name = data.login;
        var listElement = window.document.getElementById("contrList");
        var divCard = document.createElement("div");
        divCard.className = "card m-3";
        var divCardBody = document.createElement('div');
        divCardBody.className="card-body";
        var imgAvatar = document.createElement("img");
        imgAvatar.src = avatar;
        imgAvatar.className = "float-left rounded-circle mr-2";
        imgAvatar.width="50";
        imgAvatar.height="50";
        var textWrapDiv = document.createElement("div");
        textWrapDiv.className="px-md-5 mx-md-5 mx-sm-2 px-sm-2";
        var h5 = document.createElement("h5");
        var accountLink = document.createElement("a");
        accountLink.href = url;
        accountLink.innerText=name;
        h5.appendChild(accountLink);
        var h6 = document.createElement("h6");
        h6.innerText = name==="FlavioAdamo"?"Maintainer":"Contributor";
        h6.className= "text-secondary";
        textWrapDiv.appendChild(h5);
        textWrapDiv.appendChild(h6);
        divCardBody.appendChild(imgAvatar);
        divCardBody.appendChild(textWrapDiv);

        divCard.appendChild(divCardBody);
        listElement.appendChild(divCard);

    }
}

setList();
