export interface IApp {
    workspace: IWorkspace;
    onload(): void;
    onunload(): void;
}

export interface IWorkspace {
    app: IApp;
    leftSplit: IWorkspaceSplit;
    rightSplit: IWorkspaceSplit;
    getLeaf(createIfNeeded?: boolean): IWorkspaceLeaf;
    toggleLeftSplit(): void;
    toggleRightSplit(): void;
}

export interface IWorkspaceSplit extends IWorkspaceItem {
    collapsed: boolean;
    setCollapsed(collapsed: boolean): void;
    // Tab support
    children: IWorkspaceItem[];
    activeIndex: number;
    setActiveIndex(index: number): void;
}

export interface IWorkspaceItem {
    // Common properties
}

export interface IWorkspaceLeaf extends IWorkspaceItem {
    viewState: any;
    view: any;
    setViewState(viewState: any): void;
    openFile(file: any): void;
}
