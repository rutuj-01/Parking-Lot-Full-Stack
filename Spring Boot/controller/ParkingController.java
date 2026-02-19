package com.scb.retail.parkinglot.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.scb.retail.parkinglot.bean.Parking;
import com.scb.retail.parkinglot.service.ParkingService;

@RestController
public class ParkingController {

	@Autowired
	private ParkingService parkService;

	@GetMapping("/getallcars")
	public List<Parking> getAllCars() {
		List<Parking> cars = parkService.getAllCars();
		System.out.println("Total cars: " + cars.size()); 
		return cars;
	}

	@GetMapping("/getcar/{id}")
	public Parking getAppById(@PathVariable Integer id) {
		return parkService.getCarByTicketNo(id);
	}
	
	@GetMapping("/getlatestcar")
	public Parking getLatestCar() {
		return parkService.getLatestCar();
	}

	@PostMapping("/addcar")
	public void addApp(@RequestBody Parking car) {
		System.out.println("Adding Car: " + car.size());
		parkService.addCar(car);
	}
	
	@PutMapping("/updateCar/{id}")
	public void updateCar(@PathVariable int id) {
		parkService.updateCar(id);
	}
	
	

}