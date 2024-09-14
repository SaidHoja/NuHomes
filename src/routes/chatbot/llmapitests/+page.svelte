<script>
async function sendRequest(){
    console.log('sending request');
    const response = await fetch('/api/chatbot', {
        method: 'POST',
        body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
        headers: {
            'content-type': 'application/json'
        }
    });
    let llmRes = await response.json();
    console.log(llmRes);
    document.getElementById('response').innerHTML = JSON.stringify(llmRes.message);
}

</script>

<div>
    <h1>Chatbot</h1>
    <p>Chatbot page</p>
    <div id="response">chat</div>
    <button on:click={sendRequest}>Request</button>
</div>