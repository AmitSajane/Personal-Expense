import Foundation
import EventKit
import React

@objc(CalendarModule)
class CalendarModule: NSObject {
  
  private let eventStore = EKEventStore()
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func requestCalendarAccess(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    eventStore.requestAccess(to: .event) { granted, error in
      DispatchQueue.main.async {
        if let error = error {
          reject("CALENDAR_ERROR", "Failed to request calendar access", error)
        } else {
          resolve(granted)
        }
      }
    }
  }
  
  @objc
  func createEvent(_ title: String, startDate: NSNumber, endDate: NSNumber, notes: String?, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    
    guard EKEventStore.authorizationStatus(for: .event) == .authorized else {
      reject("CALENDAR_PERMISSION", "Calendar access not granted", nil)
      return
    }
    
    let event = EKEvent(eventStore: eventStore)
    event.title = title
    event.startDate = Date(timeIntervalSince1970: startDate.doubleValue / 1000)
    event.endDate = Date(timeIntervalSince1970: endDate.doubleValue / 1000)
    event.notes = notes
    event.calendar = eventStore.defaultCalendarForNewEvents
    
    do {
      try eventStore.save(event, span: .thisEvent)
      resolve([
        "id": event.eventIdentifier,
        "title": event.title,
        "startDate": event.startDate.timeIntervalSince1970 * 1000,
        "endDate": event.endDate.timeIntervalSince1970 * 1000,
        "notes": event.notes ?? ""
      ])
    } catch {
      reject("CALENDAR_SAVE_ERROR", "Failed to save event", error)
    }
  }
  
  @objc
  func getEvents(_ startDate: NSNumber, endDate: NSNumber, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    
    guard EKEventStore.authorizationStatus(for: .event) == .authorized else {
      reject("CALENDAR_PERMISSION", "Calendar access not granted", nil)
      return
    }
    
    let start = Date(timeIntervalSince1970: startDate.doubleValue / 1000)
    let end = Date(timeIntervalSince1970: endDate.doubleValue / 1000)
    
    let predicate = eventStore.predicateForEvents(withStart: start, end: end, calendars: nil)
    let events = eventStore.events(matching: predicate)
    
    let eventData = events.map { event in
      return [
        "id": event.eventIdentifier,
        "title": event.title,
        "startDate": event.startDate.timeIntervalSince1970 * 1000,
        "endDate": event.endDate.timeIntervalSince1970 * 1000,
        "notes": event.notes ?? ""
      ]
    }
    
    resolve(eventData)
  }
  
  @objc
  func deleteEvent(_ eventId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    
    guard EKEventStore.authorizationStatus(for: .event) == .authorized else {
      reject("CALENDAR_PERMISSION", "Calendar access not granted", nil)
      return
    }
    
    guard let event = eventStore.event(withIdentifier: eventId) else {
      reject("CALENDAR_EVENT_NOT_FOUND", "Event not found", nil)
      return
    }
    
    do {
      try eventStore.remove(event, span: .thisEvent)
      resolve(true)
    } catch {
      reject("CALENDAR_DELETE_ERROR", "Failed to delete event", error)
    }
  }
}
