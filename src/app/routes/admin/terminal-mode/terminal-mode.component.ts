import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, copyArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { ITerminalModeModel, ITerminalModel, MODE_DATA, TERMINAL_DATA } from '../models/terminal-mode.model';

@Component({
  selector: 'app-terminal-mode',
  templateUrl: './terminal-mode.component.html',
  styleUrls: ['./terminal-mode.component.scss']
})
export class TerminalModeComponent implements OnInit {

  modes: ITerminalModeModel[];
  terminals: ITerminalModel[];
  selectedMode: ITerminalModeModel;
  selectedTerminal: ITerminalModel;
  selectedTerminalMode: ITerminalModel;

  constructor() { }

  ngOnInit() {
    this.modes = [...MODE_DATA];
    this.terminals = [...TERMINAL_DATA];
    this.selectedMode = this.modes[0];
    this.selectedTerminalMode = this.selectedMode.terminals[0];
    this.selectedTerminal = this.terminals[0];
  }

  addterminalToMode(mode: ITerminalModeModel, terminal: ITerminalModel) {
    if (!!mode && !!terminal) {
      mode.terminals.push(terminal);
    }
  }

  removeterminalToMode(mode: ITerminalModeModel, terminal: ITerminalModel) {
    if (!!mode && !!terminal) {
      const currentIndex = mode.terminals.indexOf(terminal);
      mode.terminals.splice(currentIndex, 1);
      if (terminal.id === this.selectedTerminalMode.id) {
        const newIndex = currentIndex === 0 ? 0 : currentIndex - 1;
        this.selectedTerminalMode = mode.terminals.length === 0 ? null : mode.terminals[newIndex];
      }
    }
  }

  changeMode(mode: ITerminalModeModel) {
    this.selectedMode = mode;
    this.selectedTerminalMode = this.selectedMode.terminals[0];
  }

  changeterminal(terminal: ITerminalModel) {
    this.selectedTerminal = terminal;
  }

  changeterminalMode(terminal: ITerminalModel) {
    this.selectedTerminalMode = terminal;
  }

  dropterminalToMode(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  canMoveLeft() {
    return !!this.selectedTerminal && !this.selectedMode.terminals.find(terminal => terminal.id === this.selectedTerminal.id);
  }

  canMoveRight() {
    return !!this.selectedTerminalMode;
  }

  dropterminalToterminal(event: CdkDragDrop<string[]>, mode: ITerminalModeModel) {
    if (event.previousContainer !== event.container) {
      this.removeterminalToMode(mode, event.item.data);
    }
  }

  terminalModePredicate(drag: CdkDrag<ITerminalModel>, dropList: CdkDropList<ITerminalModeModel[]>) {
    return !dropList.data.find(c => c.id === drag.data.id);
  }

  isterminalExisted(terminal: ITerminalModel, terminalList: ITerminalModel[]) {
    return !!terminalList.find(c => c.id === terminal.id);
  }

}
