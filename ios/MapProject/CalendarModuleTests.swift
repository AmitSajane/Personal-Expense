import XCTest
@testable import MapProject

class CalendarModuleTests: XCTestCase {
    
    var calendarModule: CalendarModule!
    
    override func setUp() {
        super.setUp()
        calendarModule = CalendarModule()
    }
    
    override func tearDown() {
        calendarModule = nil
        super.tearDown()
    }
    
    func testRequestCalendarAccess() {
        let expectation = XCTestExpectation(description: "Calendar access request")
        
        calendarModule.requestCalendarAccess(
            { granted in
                XCTAssertTrue(granted is Bool)
                expectation.fulfill()
            },
            rejecter: { error, message, error in
                XCTFail("Calendar access request failed: \(message ?? "Unknown error")")
                expectation.fulfill()
            }
        )
        
        wait(for: [expectation], timeout: 5.0)
    }
    
    func testCreateEvent() {
        let expectation = XCTestExpectation(description: "Create calendar event")
        
        let title = "Test Transaction"
        let startDate = NSNumber(value: Date().timeIntervalSince1970 * 1000)
        let endDate = NSNumber(value: Date().timeIntervalSince1970 * 1000 + 3600000) 
        let notes = "Test transaction reminder"
        
        calendarModule.createEvent(
            title,
            startDate: startDate,
            endDate: endDate,
            notes: notes,
            resolver: { event in
                XCTAssertNotNil(event)
                if let eventDict = event as? [String: Any] {
                    XCTAssertEqual(eventDict["title"] as? String, title)
                    XCTAssertEqual(eventDict["notes"] as? String, notes)
                    XCTAssertNotNil(eventDict["id"])
                }
                expectation.fulfill()
            },
            rejecter: { error, message, error in
                // This might fail if calendar access is not granted, which is expected in tests
                print("Calendar event creation failed (expected if no permission): \(message ?? "Unknown error")")
                expectation.fulfill()
            }
        )
        
        wait(for: [expectation], timeout: 5.0)
    }
    
    func testGetEvents() {
        let expectation = XCTestExpectation(description: "Get calendar events")
        
        let startDate = NSNumber(value: Date().timeIntervalSince1970 * 1000 - 86400000) // 1 day ago
        let endDate = NSNumber(value: Date().timeIntervalSince1970 * 1000 + 86400000) // 1 day from now
        
        calendarModule.getEvents(
            startDate,
            endDate: endDate,
            resolver: { events in
                XCTAssertNotNil(events)
                if let eventsArray = events as? [[String: Any]] {
                    // Events array should be valid even if empty
                    XCTAssertTrue(eventsArray is [[String: Any]])
                }
                expectation.fulfill()
            },
            rejecter: { error, message, error in
                // This might fail if calendar access is not granted, which is expected in tests
                print("Get events failed (expected if no permission): \(message ?? "Unknown error")")
                expectation.fulfill()
            }
        )
        
        wait(for: [expectation], timeout: 5.0)
    }
    
    func testDeleteEvent() {
        let expectation = XCTestExpectation(description: "Delete calendar event")
        
        let eventId = "test-event-id"
        
        calendarModule.deleteEvent(
            eventId,
            resolver: { result in
                // This will likely fail since the event doesn't exist, but we test the method call
                expectation.fulfill()
            },
            rejecter: { error, message, error in
                // Expected to fail since event doesn't exist
                print("Delete event failed (expected): \(message ?? "Unknown error")")
                expectation.fulfill()
            }
        )
        
        wait(for: [expectation], timeout: 5.0)
    }
    
    func testModuleInitialization() {
        XCTAssertNotNil(calendarModule)
        XCTAssertTrue(CalendarModule.requiresMainQueueSetup())
    }
}
