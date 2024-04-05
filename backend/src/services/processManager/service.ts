import { Observer, Subject } from "rxjs";
import { EventType, FlowEvent } from "./types.js";
import { eventModel } from "./model.js";
import { debugLog } from "src/utils.js";

class userProcessManager {
  context: { allocationId?: string; activityId?: string };
  eventsSubject: any;

  constructor() {
    this.context = {};
    this.eventsSubject = new Subject<EventType<FlowEvent>>();
  }
}

export class processManager {
  private eventBus: Subject<EventType<FlowEvent>>;

  public subscribe(observer: Observer<EventType<FlowEvent>>) {
    return this.eventBus.subscribe(observer);
  }

  processEvent(event: EventType<FlowEvent>) {
    debugLog("processManager", "Processing event", event);
    eventModel.create(event);
  }

  userWorld() {
    //TO trnsform events so last debit note per activiti is visible as well as
    // current capacity
  }

  constructor() {
    this.eventBus = new Subject<EventType<FlowEvent>>();
    this.eventBus.subscribe((event) => {
      this.processEvent(event);
    });
  }
  //TODO : implement finish user processing logic
}
