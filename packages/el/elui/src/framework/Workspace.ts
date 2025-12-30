import type { IApp } from './Interfaces';

export type WorkspaceItemType = 'split' | 'leaf';
export type WorkspaceSplitDirection = 'horizontal' | 'vertical' | 'tabs';

export abstract class WorkspaceItem {
  parent: WorkspaceSplit | null = null;
  type: WorkspaceItemType;

  constructor(public workspace: Workspace) {}

  abstract getContainer(): any; // Future: Return DOM or Native element ref if needed
}

export class WorkspaceLeaf extends WorkspaceItem {
  type: WorkspaceItemType = 'leaf';
  viewState: any; // { type: 'markdown', state: {} }
  view: any; // The actual view instance

  constructor(workspace: Workspace) {
    super(workspace);
  }

  getContainer(): any {
    return null;
  }

  setViewState(viewState: any) {
    this.viewState = viewState;
    // Notify React layer to re-render
    this.workspace.trigger('layout-change');
  }

  openFile(file: any) {
    this.setViewState({ type: 'file', file });
  }
}

export class WorkspaceSplit extends WorkspaceItem {
  type: WorkspaceItemType = 'split';
  children: WorkspaceItem[] = [];
  direction: WorkspaceSplitDirection = 'vertical';
  collapsed: boolean = false;
  activeIndex: number = 0;

  // Size state
  size: number = 250;
  minSize: number = 150;
  maxSize: number = 600;
  private lastSize: number = 250;

  constructor(workspace: Workspace, direction: WorkspaceSplitDirection = 'vertical') {
    super(workspace);
    this.direction = direction;
  }

  getContainer(): any {
    return null;
  }

  addChild(item: WorkspaceItem, index?: number) {
    item.parent = this;
    if (index !== undefined) {
      this.children.splice(index, 0, item);
    } else {
      this.children.push(item);
    }
    // Set new child as active
    this.activeIndex = index !== undefined ? index : this.children.length - 1;
    this.workspace.trigger('layout-change');
  }

  removeChild(item: WorkspaceItem) {
    const index = this.children.indexOf(item);
    if (index > -1) {
      this.children.splice(index, 1);
      item.parent = null;

    // Update active index if necessary
    if (this.activeIndex >= this.children.length) {
        this.activeIndex = Math.max(0, this.children.length - 1);
    }
    this.workspace.trigger('layout-change');
    }
  }

  setCollapsed(collapsed: boolean) {
    if (collapsed) {
        this.lastSize = this.size;
        // Optionally set size to 0 or keeping it as is?
        // Usually we keep 'size' as the expanded size logic handles 0,
        // but PaneWithSeparator usually expects a width.
        // Let's assume we just toggle the flag and the View handles hiding.
    } else {
        // Restoring...
        // If size was somehow reset, restore from lastSize
        if (this.size < this.minSize) {
            this.size = this.lastSize;
        }
    }
    this.collapsed = collapsed;
    this.workspace.trigger('layout-change');
  }

  setSize(size: number) {
      this.size = size;
      this.workspace.trigger('layout-change');
  }

  setActiveIndex(index: number) {
      if (index >= 0 && index < this.children.length) {
          if (this.activeIndex !== index) {
              this.activeIndex = index;
              this.workspace.trigger('layout-change');
          }
      }
  }
}

export class Workspace {
  app: IApp;
  rootSplit: WorkspaceSplit;
  activeLeaf: WorkspaceLeaf | null = null;
  leftSplit: WorkspaceSplit; // Sidebar (Ribbon + File Explorer usually)
  rightSplit: WorkspaceSplit; // Right Sidebar (Inspector/Calendar etc.)

  // Simple event system placeholder
  private listeners: { [key: string]: Function[] } = {};

  constructor(app: IApp) {
    this.app = app;
    this.rootSplit = new WorkspaceSplit(this, 'vertical');
    this.leftSplit = new WorkspaceSplit(this, 'vertical'); // Hidden by default usually
    this.rightSplit = new WorkspaceSplit(this, 'vertical'); // Hidden by default usually
  }

  getLeaf(createIfNeeded: boolean = true): WorkspaceLeaf {
    // Basic implementation: if no active leaf, try to find one, or create one
    if (this.activeLeaf) return this.activeLeaf;

    // Traverse rootSplit to find first leaf
    const findLeaf = (item: WorkspaceItem): WorkspaceLeaf | null => {
      if (item instanceof WorkspaceLeaf) return item;
      if (item instanceof WorkspaceSplit) {
        for (const child of item.children) {
          const found = findLeaf(child);
          if (found) return found;
        }
      }
      return null;
    };

    let leaf = findLeaf(this.rootSplit);
    if (!leaf && createIfNeeded) {
      leaf = new WorkspaceLeaf(this);
      this.rootSplit.addChild(leaf);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return leaf!;
  }

  toggleLeftSplit() {
    this.leftSplit.setCollapsed(!this.leftSplit.collapsed);
  }

  toggleRightSplit() {
    this.rightSplit.setCollapsed(!this.rightSplit.collapsed);
  }

  // Event system
  on(event: string, callback: Function) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  trigger(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(...args));
    }
  }
}
