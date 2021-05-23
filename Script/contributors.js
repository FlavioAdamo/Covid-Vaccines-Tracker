
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
    const template = document.querySelector('#contrTemplate');
    const listElement = document.querySelector('#contrList');
    for (let i = 0; i < listOfContributors.length; i++) {
        const { avatar_url, html_url, login: name} = listOfContributors[i];
        
        const content = template.content.cloneNode(true);

        // Change image
        content.querySelector('img').src = avatar_url;

        // Change link
        const accountLink = content.querySelector('a');
        accountLink.href = html_url;
        accountLink.innerText= name;

        // Change secondary text
        if (name === 'FlavioAdamo') content.querySelector('h6').innerText = 'Maintainer';
        
        listElement.appendChild(content);

    }
}

setList();
