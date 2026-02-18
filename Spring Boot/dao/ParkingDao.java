package com.scb.retail.parkinglot.dao;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.scb.retail.parkinglot.bean.Parking;

@Transactional
@Repository
public class ParkingDao {

	@Autowired
	JdbcTemplate jdbcTemplate;

	// ERROR 1: THREAD-SAFETY/STATE LEAK - Shared instance variable in a Singleton. 
	// If two users call getAllCars(), they will overwrite this same list, causing data corruption.
	List<Parking> parkList = new ArrayList<Parking>();

	public List<Parking> getAllCars() {
		String sql = "select * from parking";
		RowMapper<Parking> rowmapper = new ParkingRowMapper();
		parkList = this.jdbcTemplate.query(sql, rowmapper);
		return parkList;
	}

	public Parking getCarByTicketNo(int id) {
		// ERROR 2: Potential EmptyResultDataAccessException - queryForObject throws an 
		// exception if no record is found. This will crash the API with a 500 error 
		// instead of returning null or an Optional.
		String sql = "select * from parking where ticket_number=?";
		RowMapper<Parking> rowmapper = new ParkingRowMapper();
		Parking app = this.jdbcTemplate.queryForObject(sql, rowmapper, id);
		return app;
	}

	public Parking getLatestCar() {
		String sql = "select * from parking where ticket_number= (select last_value from parking_ticket_number_seq)";
		RowMapper<Parking> rowmapper = new ParkingRowMapper();
		// ERROR 3: Null Safety - If the sequence is new or database is empty, 
		// this returns null. The calling service will likely hit a NullPointerException.
		return this.jdbcTemplate.queryForObject(sql, rowmapper);
	}

	public void addCar(Parking car) {
		// ERROR 4: SQL Injection/Logic - 'car.getCarSize()' is used without null validation. 
		// Also, hardcoded strings 'small', 'Medium', 'Large' are inconsistent (case sensitivity).
		String sql = "insert into parking (car_size) values(?)";
		this.jdbcTemplate.update(sql, car.getCarSize());
		
		// ERROR 5: Performance/Race Condition - Running 3 separate updates after 1 insert 
		// is O(N) database overhead. Should be handled via a Database Trigger or a 
		// single batch update to ensure atomicity and speed.
		String sql1 = "update slots set car_count = (select count(car_size) from parking where car_size = 'small' AND status = 'parked') where car_size = 'small'";
		this.jdbcTemplate.update(sql1);
		
		String sql2 = "update slots set car_count = (select count(car_size) from parking where car_size = 'Medium' AND status = 'parked') where car_size = 'medium'";
		this.jdbcTemplate.update(sql2);
		
		String sql3 = "update slots set car_count = (select count(car_size) from parking where car_size = 'Large' AND status = 'parked') where car_size = 'large'";
		this.jdbcTemplate.update(sql3);
	}
	
	public void updateCar(int id) {
		String sql = "update parking set status='exited',checkout_time = (select current_time(0)) where ticket_number=?";
		this.jdbcTemplate.update(sql, id);
		// (Same repetitive update logic follows...)
	}
}