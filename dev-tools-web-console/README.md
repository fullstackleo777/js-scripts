# Javascript Scripts for Dev Tools Web Console
## General-use JavaScript functions you can run in the browser's developer tools console to inspect, manipulate, and interact with web pages dynamically

---

### **1. Inspecting and Logging**
- **Log all links on a page:**
  ```javascript
  Array.from(document.querySelectorAll('a')).map(a => a.href);
  ```

- **Check all images (with their sources):**
  ```javascript
  Array.from(document.querySelectorAll('img')).map(img => img.src);
  ```

- **Log all elements with a specific class:**
  ```javascript
  document.querySelectorAll('.your-class-name');
  ```

- **View all cookies:**
  ```javascript
  console.log(document.cookie);
  ```

---

### **2. Manipulating the DOM**
- **Change the background color of a page:**
  ```javascript
  document.body.style.backgroundColor = 'lightblue';
  ```

- **Hide all images on a page:**
  ```javascript
  document.querySelectorAll('img').forEach(img => img.style.display = 'none');
  ```

- **Add a border to all paragraphs:**
  ```javascript
  document.querySelectorAll('p').forEach(p => p.style.border = '1px solid red');
  ```

- **Add new content to the page:**
  ```javascript
  const newDiv = document.createElement('div');
  newDiv.textContent = 'Hello, this is a new div!';
  document.body.appendChild(newDiv);
  ```

---

### **3. Working with Forms**
- **Fill all text inputs with default text:**
  ```javascript
  document.querySelectorAll('input[type="text"]').forEach(input => input.value = 'Default text');
  ```

- **Submit the first form on the page:**
  ```javascript
  document.forms[0].submit();
  ```

---

### **4. Performance & Debugging**
- **Measure script execution time:**
  ```javascript
  console.time('Execution Time');
// Your script here
  console.timeEnd('Execution Time');
  ```

- **Track events (like clicks):**
  ```javascript
  document.body.addEventListener('click', event => console.log(event.target));
  ```

---

### **5. Fun or Visual Tricks**
- **Rotate the entire page:**
  ```javascript
  document.body.style.transform = 'rotate(180deg)';
  ```

- **Make text rainbow-colored (simple effect):**
  ```javascript
  const paragraphs = document.querySelectorAll('p');
  let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  paragraphs.forEach((p, index) => p.style.color = colors[index % colors.length]);
  ```

---

### **6. Fetching Data**
- **Fetch JSON from an API:**
  ```javascript
  fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data));
  ```

---

### **7. Debugging and Utilities**
- **List all event listeners attached to an element (requires Chrome or advanced tools):**
  ```javascript
  getEventListeners(document.body);
  ```

- **Check the type of an object:**
  ```javascript
  console.log(typeof yourVariable);
  ```

- **Reload the page automatically after a delay:**
  ```javascript
  setTimeout(() => location.reload(), 5000); // 5 seconds
  ```

---

### **8. Accessibility Tools**
- **Highlight all elements with missing alt attributes:**
  ```javascript
  document.querySelectorAll('img:not([alt])').forEach(img => img.style.border = '3px dashed red');
  ```

- **Check for tabbing issues:**
  ```javascript
  Array.from(document.querySelectorAll('*')).filter(el => el.tabIndex > 0).forEach(el => console.log(el));
  ```

---
