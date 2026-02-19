import React from 'react';
import axios from 'axios';
import car from './car.jpg';

class Park extends React.Component {
    // ERROR 1: Missing constructor/initial state check. 
    state = {
        ticket_number: '',
        car_size: '',
        checkin_time: '',
        parking_slot: '',
        count: null // Initialized to null to test NPE logic
    }

    componentWillMount() {
        axios.get("http://localhost:8080/getlatestcar/")
            .then((response) => {
                // ERROR 3: Potential NPE. 
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
                console.log(this.state.count) 
            })
            // ERROR 6: Unhandled Promise Rejection.
            // the UI hangs and the console fills with errors.
    }

    close() {
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