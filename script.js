document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointmentForm');
    const responseMsg = document.getElementById('responseMsg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            department: document.getElementById('department').value,
            date: document.getElementById('date').value,
            message: document.getElementById('message').value.trim()
        };

        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                responseMsg.textContent = 'Appointment booked. ID: ' + data.id;
                form.reset();
            } else {
                responseMsg.textContent = 'Error: ' + (data.message || 'Unable to save');
            }
        } catch (err) {
            responseMsg.textContent = 'Network error';
            console.error(err);
        }
    });
});

function scrollToAppointment() {
    document.getElementById('appointment').scrollIntoView({ behavior: 'smooth' });
}
function toggleButton(){
    document.getElementById('appointment').reset();
    document.getElementById('display').innerHTML("Thank-you! Form cleared");
}