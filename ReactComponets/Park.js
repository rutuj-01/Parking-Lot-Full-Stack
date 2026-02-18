import React from 'react';
import axios from 'axios';
import car from './car.jpg';

class Park extends React.Component {
    // ERROR 1: Missing constructor/initial state check. 
    // If render() triggers before axios finishes, this.state.count[0] will crash.
    state = {
        ticket_number: '',
        car_size: '',
        checkin_time: '',
        parking_slot: '',
        count: null // Initialized to null to test NPE logic
    }

    // ERROR 2: Deprecated Lifecycle Method. 
    // componentWillMount is deprecated and can lead to side-effect bugs in React Fiber.
    componentWillMount() {
        axios.get("http://localhost:8080/getlatestcar/")
            .then((response) => {
                // ERROR 3: Potential NPE. 
                // If response.data is null or the server sends a 204 No Content, 
                // accessing .ticketNumber will throw an Uncaught TypeError.
                this.setState({
                    ticket_number: response.data.ticketNumber,
                    car_size: response.data.carSize,
                    checkin_time: response.data.checkinTime
                })
            })

        axios.get("http://localhost:8080/getcarcount")
            .then(res => {
                var pre = ''
                // ERROR 4: Logic Flaw & Type Safety. 
                // Accessing res.data[0] without checking if the array has elements. 
                // Also 'Medium' vs 'medium' string comparison is inconsistent.
                if (res.data[0].carCount <= 5 && this.state.car_size == "small") {
                    pre = 'S' + (res.data[0].carCount);
                }
                else if (res.data[1].carCount <= 4 && this.state.car_size == "Medium") {
                    pre = 'M' + (res.data[1].carCount);
                }
                
                this.setState({
                    count: res.data,
                    parking_slot: pre
                })
                // ERROR 5: State Access Race Condition.
                // console.log(this.state.count) right after setState is unreliable 
                // because setState is asynchronous.
                console.log(this.state.count) 
            })
            // ERROR 6: Unhandled Promise Rejection.
            // No .catch() block for axios calls. If the server is down, 
            // the UI hangs and the console fills with errors.
    }

    close() {
        // ERROR 7: Potential Crash.
        // Accessing this.props.history without checking if the component is 
        // properly wrapped in withRouter or a Route.
        this.props.history.push("/")
    }

    render() {
        // The check below is good, but the componentWillMount errors 
        // will likely crash the app before it even hits this logic.
        if (this.state === null) {
            return null;
        }
        return (
            <div>
               {/* UI Rendering Logic */}
            </div>
        );
    }
}

export default Park;