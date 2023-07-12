const table = document.querySelector('tbody'),
      url = "https://jsonplaceholder.typicode.com/";

const usersData = async () => {
  let resp = await fetch(url + 'users/');
  let data = resp.json();
  return data;
};
const postsData = async () => {
  let resp = await fetch(url + 'posts/');
  let data = resp.json();
  return data;
};

// dynamic style class setting
const setStyle = (styleList, elm) => {
  styleList.forEach( style => {
    elm.classList.add(style);
  });
}

// get all posts for a single user
const userPosts = (userID, posts) => {
  let userPosts = posts.filter( post => post.userId === userID);
  
  return {
    posts: userPosts,
    count: userPosts.length
  }
};
// display user's posts
const showPosts = (postList) => {
  let div = document.createElement('div'),
      ul = document.createElement('ul');
  
  setStyle(['post_list'], ul);
  
  // selection of choices for publish date
  const getRandomMonth = () => {
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    return month[Math.floor(Math.random() * (month.length))].slice(0, 3);
  }
  // random selection inclusive of max
  const getRandomNum = (max, min=0) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  postList.forEach( (item, i) => {
     let li = document.createElement('li'), 
        name = document.createElement('h3'),
        items = document.createElement('div'),
        pubDate = document.createElement('span'), 
        views = document.createElement('span');

    // capitalize first letter of post title
    let title = postList[i].title.charAt(0).toUpperCase() + postList[i].title.slice(1);
    name.textContent = title;
    
    pubDate.innerHTML = '<i class="bi bi-calendar4"></i> ' + getRandomMonth() + ' ' + getRandomNum(2023, 2001);
    
    views.innerHTML = '<i class="bi bi-eye"></i> ' + getRandomNum(10000).toLocaleString();
    
    [pubDate, views].forEach( item => items.appendChild(item));
    
    [name, items].forEach( item => li.appendChild(item));
    
    ul.appendChild(li);
  });
   
  div.appendChild(ul);
  
  return div.innerHTML;
};

const getUsername = (n, u) => {
  const div = document.createElement('div'),
        name = document.createElement('p'),
        user = document.createElement('span');
  
  name.innerText = n;
  name.classList.add('user_name');
  user.innerText = '@' + u;
  user.classList.add('user_username');
  
  [name, user].forEach( item => div.appendChild(item));
  return div.innerHTML;
};
const getStatus = (isActive) => {
  const div = document.createElement('div'),
    indicator = document.createElement('span'),
        indicatorText = document.createElement('span');
  
  let classList = [
    'user_status',
    isActive ? 'green' : 'red'
  ]

  setStyle(classList, indicator);
  
  indicatorText.innerText = (isActive ? 'Active' : 'Inactive');
  
  div.innerHTML = indicator.outerHTML + indicatorText.outerHTML;
 
  return div.innerHTML;
};
const getPhone = (phone) => {
  let number;
  // add space after closing parens
  phone = phone.replace(/\)/, ') ');
   
  // remove entensions
  if(phone.includes('x')) {
    number = phone.split('x')[0].trim();
    return number
  } else {
    return phone
  }
}
const getContact = () => {
  const div = document.createElement('div'),
        button = document.createElement('button');
  
  let classList = [
    'btn_pill',
    'contact_btn'
  ];
  
  setStyle(classList, button);
  
  button.innerText = 'Contact';
  button.setAttribute('type', 'button');
  
  div.appendChild(button);
  return div.innerHTML;
};



const addRow = (user, isActive, posts) => {
  let tr = document.createElement('tr'),
      tdUser = document.createElement('td'),
      tdStatus = document.createElement('td'),
      tdLocation = document.createElement('td'),
      tdPhone = document.createElement('td'),
      tdContact = document.createElement('td'),
      tdPosts = document.createElement('td'),
      tdPostList = document.createElement('td'),
      trPostList = document.createElement('tr');
  
  let { 
    id,
    name, 
    username,
    address: { city },
    phone
  } = user;
  // console.log(name, username)
  
  let { count, posts: postsList } = userPosts(id, posts);
  
  tdUser.innerHTML = getUsername(name, username);
  tdStatus.innerHTML = getStatus(isActive);
  tdLocation.innerText = city;
  tdPhone.innerText = getPhone(phone);
  tdContact.innerHTML = getContact();
  tdPosts.innerHTML = `
  <strong>${count}</strong> <button id="posts-btn-${id}" class="post_total btn_pill" type="button" aria-controls="post-list-${id}"><span>View all <span class="arrow_icon"><i class="bi bi-chevron-down"></i></span></span></button>
  `;
  tdPostList.innerHTML = showPosts(postsList); 
  tdPostList.setAttribute('colspan', '100%');
  
  [tdUser,tdStatus,tdLocation, tdPhone, tdContact,tdPosts].forEach( item => tr.appendChild(item));
  
  trPostList.appendChild(tdPostList);
  trPostList.setAttribute('id', `post-list-${id}`);
  trPostList.setAttribute('aria-labelledby', `posts-btn-${id}`);
  // trPostList.setAttribute('hidden', true);
  trPostList.setAttribute('aria-hidden', true);
  trPostList.classList.add('hidden');
  
  table.appendChild(tr);
  table.appendChild(trPostList);
}



( async () => {
  const users = await usersData(); // 10 users
  const posts = await postsData(); // 100 posts
  
  let isActive;
  // add each user to table 
  users.forEach( user => {
    isActive = posts.some( post => post.userId === user.id);
    addRow(user, isActive, posts);
  });
  
  // show panel for each row
 document.querySelectorAll('.post_total').forEach( btn => {
    const togglePanel = e => {
      let target = e.target.getAttribute('aria-controls');
      let postList = table.querySelector(`#${target}`);
      let isHidden = postList.classList.contains('hidden');
      // postList.toggleAttribute('hidden');
      postList.classList.toggle('hidden');
      postList.setAttribute('aria-hidden', !isHidden);
      e.target.querySelector('.arrow_icon').classList.toggle('arrow_up');
    }
    btn.addEventListener('click', togglePanel);
  });
})();

