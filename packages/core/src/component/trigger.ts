import { _ } from "../context";
import { Component } from "./component";

/**
 * The base class of all trigger components.
 *
 * A trigger component is a component that can fire events with data.
 * The return value of the context function is whether the event is fired.
 */
export abstract class TriggerComponent<Ev = unknown> extends Component {
  private $_fired = false;
  private $_firedData: Ev;

  /**
   * Fire an event with data.
   *
   * @param data The data of the event.
   */
  protected readonly $fire = (data: Ev) => {
    this.$_fired = true;
    this.$_firedData = data;
    this.$app.recv();
  };

  /**
   * Create a function that fires an event with data.
   *
   * @param data The data of the event.
   * @returns A function that fires the event.
   */
  protected readonly $fireWith = (data: Ev) => () => this.$fire(data);

  protected get $fired() {
    if (_.$recvContext && this.$_fired) {
      this.$_fired = false;
      (_ as any).$ev = this.$_firedData;
      return true;
    } else {
      return false;
    }
  }
}
