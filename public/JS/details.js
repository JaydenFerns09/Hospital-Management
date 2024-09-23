let searchTimeout;

    function search_doctor() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function () {
        let input = document.getElementById('searchbar').value.trim().toLowerCase();
        let x = document.getElementsByClassName('docname');
        let y = document.getElementsByClassName('tuple');

        for (let i = 0, j = 0; i < x.length && j < y.length; i++, j++) {
            if (input.trim() === "") {
                // If the search input is empty, show all items
                y[j].style.display = "flex";
            } else if (!x[i].innerHTML.toLowerCase().includes(input)) { 
                y[j].style.display = "none"; 
            } else { 
                y[j].style.display = "flex"; // Assuming 'flex' is the default display property for your 'tuple' elements
            }
        }
    }, 300); // Adjust the delay as needed
}

// Add an event listener for the 'input' event on the search bar element (#searchbar)
document.getElementById('searchbar').addEventListener('input', search_doctor);

var count = 1;
function addQualificationField() {
  const container = document.getElementById('qualifications-cont');
  const newField = document.createElement('div');
  newField.className = 'qualification-field';
  newField.innerHTML = `
    <div class="row">
      <input class="col" type="text" required="" autocomplete="off" name="qualifications[${count}][year]" placeholder="Year of Completion">
      <input class="col" type="text" required="" autocomplete="off" name="qualifications[${count}][institute]" placeholder="Institute">
      <input class="col" type="text" required="" autocomplete="off" name="qualifications[${count}][degree]" placeholder="degree">
    </div>
    <button type="button" class="delete-btn" onclick="deleteQualificationField(this)"><span class="material-symbols-outlined">delete_forever</span></button>
  `;
  newField.style.marginTop = '3rem';
  container.appendChild(newField);
  count++;
}

function deleteQualificationField(button) {
  const container = document.getElementById('qualifications-cont');
  const field = button.parentNode;
  container.removeChild(field);
}

var xcount = 1;

function addDependantField() {
    const container = document.getElementById('qualifications-cont');
    const newField = document.createElement('div');
    newField.className = 'qualification-field';
    newField.innerHTML = `
    <div class="row">
        <input class="col" type="text" required="" autocomplete="off" name="dependants[${xcount}][Fname]" placeholder="First Name">
        <input class="col" type="text" required="" autocomplete="off" name="dependants[${xcount}][Mname]" placeholder="Middle Name">
        <input class="col" type="text" required="" autocomplete="off" name="dependants[${xcount}][Lname]" placeholder="Last Name">
    </div>
    <div class="row">
        <input class="col" type="text" required="" autocomplete="off" name="dependants[${xcount}][dob]" placeholder="DOB (YYYY-MM-DD)">
        <input class="col" type="number" required="" autocomplete="off" name="dependants[${xcount}][age]" placeholder="Age">
        <input class="col" type="text" required="" autocomplete="off" name="dependants[${xcount}][sex]" placeholder="Sex">
    </div>
    <div class="row">
        <input class="col" type="number" required="" autocomplete="off" name="dependants[${xcount}][phone]" placeholder="Phone">
        <input class="col" type="text" required="" autocomplete="off" name="dependants[${xcount}][email]" placeholder="Email">
        <input class="col" type="text" required="" autocomplete="off" name="dependants[${xcount}][relation]" placeholder="Relation">
    </div>
    <button type="disable" class="delete-btn disabled" onclick="deleteDependantField(this)"><span class="material-symbols-outlined">delete_forever</span></button>
    `;
    newField.style.marginTop = '8rem';
    container.appendChild(newField);
    xcount++;
  }
  
  function deleteDependantField(button) {
    const container = document.getElementById('qualifications-cont');
    const field = button.parentNode;
    container.removeChild(field);
  }





function previewImage() {
        const fileInput = document.getElementById('file');
        const previewLink = document.getElementById('image-preview-link');

        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                // Set the href attribute of the link to the data URL of the selected image
                previewLink.href = e.target.result;
                previewLink.style.marginTop = '-1rem';
                previewLink.style.display = 'inline'; // Display the link
            };

            reader.readAsDataURL(file);
        } else {
            // If no file is selected, hide the link
            previewLink.style.display = 'none';
        }
    }