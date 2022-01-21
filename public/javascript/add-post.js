async function newFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value;
  const content = document.querySelector('textarea[name="content"]').value;
  const topicDrop = document.getElementById('topic');
  const topic = topicDrop.options[topicDrop.selectedIndex].value;
  console.log(`this is the ${topic}`)
  
  const response = await fetch(`/api/posts`, {
    
    method: 'POST',
    body: JSON.stringify({
      title,
      content,
      topic
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
  }
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);
