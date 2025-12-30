import { IApp } from './Interfaces';
import { Workspace } from './Workspace';

export class App implements IApp {
  workspace: Workspace;
  // pluginManager: PluginManager; // Future
  // vault: Vault; // Future

  constructor() {
    this.workspace = new Workspace(this);
  }

  // Lifecycle methods
  onload() {
    console.log('App loaded');
  }

  onunload() {
    console.log('App unloaded');
  }
}
