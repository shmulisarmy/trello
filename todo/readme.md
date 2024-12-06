# Lightweight Interaction Library

A minimal library for interactive web components, enabling simple event handling, live data updates, and utilities like throttling and prefetching without using heavy frameworks or bundlers.

---

## Features

- **Throttling**: Control event frequency for smooth interactions.
- **Prefetching**: Preload data for better performance on user interactions.
- **Live Updates**: Real-time updates via WebSocket.
- **Custom Events**: Use attributes like `onintersect` for actions.
- **Utilities**: Built-in features like lazy loading and more.

---

## Usage Examples

### 1. **Throttle Search Results**
Throttle the input to reduce the number of search requests. The library handles the fetch and result rendering.

```html
<input
    type="text"
    placeholder="Search here..."
    oninput="throttle(() => searchHandler(this), 300, 'search')"
/>
<ul id="search-results"></ul>

<script>
    function searchHandler(input) {
        const query = input.value.trim();
        if (query) {
            // The library automatically fetches and updates the results
            // without needing to manually call `fetch`.
        }
    }
</script>

```








2. Hover Prefetch and Replace on Click
Prefetch data when hovering over an element and replace content on click using the cached result.

```html
<button 
    data-url="/api/details" 
    onmouseenter="prefetch(this.getAttribute('data-url'))" 
    onclick="replace(this.nextElementSibling, this.getAttribute('data-url'))"
>
    Show Details
</button>
<div>Click the button to see details.</div>
javascript
Copy code
<script>
    // The library automatically handles the prefetching and replacement.
    function replace(element, url) {
        // Replace content after prefetching
        // The library automatically fills the element content without manual fetch.
    }
</script>

```





```html
3. Real-Time Data Updates with WebSocket
Receive live updates from the server and update the UI dynamically.

html
Copy code
<div id="live-data">Waiting for updates...</div>
javascript
Copy code
<script>
    const socket = new WebSocket('ws://example.com/socket');

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        document.getElementById('live-data').innerHTML = `Live update: ${data.message}`;
    };

    socket.onclose = () => {
        document.getElementById('live-data').innerHTML = 'Connection closed. No more live updates.';
    };
</script>

```





```html


4. Infinite Scroll with onintersect
Automatically load more data as the user scrolls near the bottom of the page using the onintersect attribute.

html
Copy code
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>
<div 
    style="height: 1px;" 
    onintersect="loadMoreItems(this)"
></div>
javascript
Copy code
<script>
    function loadMoreItems(trigger) {
        // The library automatically fetches more items and updates the list.
    }
</script>


```













Apologies for the confusion earlier. Here is the full markdown content, all in one piece, as you requested:

markdown
Copy code
# Lightweight Interaction Library

A minimal library for interactive web components, enabling simple event handling, live data updates, and utilities like throttling and prefetching without using heavy frameworks or bundlers.

---

## Features

- **Throttling**: Control event frequency for smooth interactions.
- **Prefetching**: Preload data for better performance on user interactions.
- **Live Updates**: Real-time updates via WebSocket.
- **Custom Events**: Use attributes like `onintersect` for actions.
- **Utilities**: Built-in features like lazy loading and more.

---

## Usage Examples

### 1. **Throttle Search Results**
Throttle the input to reduce the number of search requests. The library handles the fetch and result rendering.

```html
<input
    type="text"
    placeholder="Search here..."
    oninput="throttle(() => searchHandler(this), 300, 'search')"
/>
<ul id="search-results"></ul>
javascript
Copy code
<script>
    function searchHandler(input) {
        const query = input.value.trim();
        if (query) {
            // The library automatically fetches and updates the results
            // without needing to manually call `fetch`.
        }
    }
</script>
2. Hover Prefetch and Replace on Click
Prefetch data when hovering over an element and replace content on click using the cached result.

html
Copy code
<button 
    data-url="/api/details" 
    onmouseenter="prefetch(this.getAttribute('data-url'))" 
    onclick="replace(this.nextElementSibling, this.getAttribute('data-url'))"
>
    Show Details
</button>
<div>Click the button to see details.</div>
javascript
Copy code
<script>
    // The library automatically handles the prefetching and replacement.
    function replace(element, url) {
        // Replace content after prefetching
        // The library automatically fills the element content without manual fetch.
    }
</script>
3. Real-Time Data Updates with WebSocket
Receive live updates from the server and update the UI dynamically.

html
Copy code
<div id="live-data">Waiting for updates...</div>
javascript
Copy code
<script>
    const socket = new WebSocket('ws://example.com/socket');

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        document.getElementById('live-data').innerHTML = `Live update: ${data.message}`;
    };

    socket.onclose = () => {
        document.getElementById('live-data').innerHTML = 'Connection closed. No more live updates.';
    };
</script>
```



4. Infinite Scroll with onintersect
Automatically load more data as the user scrolls near the bottom of the page using the onintersect attribute.


```html
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>
<div 
    style="height: 1px;" 
    onintersect="loadMoreItems(this)"
></div>
javascript
Copy code
<script>
    function loadMoreItems(trigger) {
        // The library automatically fetches more items and updates the list.
    }
</script>


```html



5. Throttle Scroll for Performance
Throttle the scroll event to reduce frequent callback executions.

html
Copy code
<div style="height: 2000px;">Scroll to see throttled events in action.</div>
javascript
Copy code
<script>
    window.addEventListener(
        'scroll',
        throttle(() => {
            console.log('Throttled scroll event!');
        }, 200, 'scroll')
    );
</script>

