export class MatrixController {
    constructor(view) {
        this.view = view;
        this.setupEventListeners();
        this.actionMap = {
            'H0': () => this.chainAnimations([() => this.view.animateCenterColumnSwaps()]),
            'H1': () => this.chainAnimations([() => this.view.animateCenterRowSwaps()]),
            'Z0': () => this.chainAnimations([() => this.view.animateSideColumnSwaps()]),
            'Z1': () => this.chainAnimations([() => this.view.animateSideRowSwaps()]),
            'P0': () => this.chainAnimations([() => this.view.animatePartialColumnSwaps()]),
            'P1': () => this.chainAnimations([() => this.view.animatePartialRowSwaps()]),
            'X0': () => this.chainAnimations([
                () => this.view.animateCenterColumnSwaps(),
                () => this.view.animateSideColumnSwaps(),
                () => this.view.animateCenterColumnSwaps()
            ]),
            'X1': () => this.chainAnimations([
                () => this.view.animateCenterRowSwaps(),
                () => this.view.animateSideRowSwaps(),
                () => this.view.animateCenterRowSwaps()
            ]),
            'CZ': () => this.chainAnimations([
                () => this.view.animatePartialColumnSwaps(),
                () => this.view.animatePartialRowSwaps()
            ]),
            'CX': () => this.chainAnimations([
                () => this.view.animateCenterColumnSwaps(),
                () => this.view.animatePartialColumnSwaps(),
                () => this.view.animatePartialRowSwaps(),
                () => this.view.animateCenterColumnSwaps()
            ]),
            'HH': () => this.chainAnimations([
                () => this.view.animateCenterColumnSwaps(),
                () => this.view.animateCenterRowSwaps()
            ]),
            // Initialization actions
            '00': () => {
                this.view.model.setCellsToOnes([[2, 0], [2, 1], [3, 0], [3, 1]]);
                this.view.createCells();
                return Promise.resolve();
            },
            '01': () => {
                this.view.model.setCellsToOnes([[2, 2], [2, 3], [3, 2], [3, 3]]);
                this.view.createCells();
                return Promise.resolve();
            },
            '10': () => {
                this.view.model.setCellsToOnes([[0, 0], [0, 1], [1, 0], [1, 1]]);
                this.view.createCells();
                return Promise.resolve();
            },
            '11': () => {
                this.view.model.setCellsToOnes([[0, 2], [0, 3], [1, 2], [1, 3]]);
                this.view.createCells();
                return Promise.resolve();
            }
        };
    }

    setupEventListeners() {
        document.getElementById('swap-columns-h').addEventListener('click', () => {
            this.chainAnimations([() => this.view.animateCenterColumnSwaps()]);
        });

        document.getElementById('swap-rows-h').addEventListener('click', () => {
            this.chainAnimations([() => this.view.animateCenterRowSwaps()]);
        });

        document.getElementById('swap-columns-z').addEventListener('click', () => {
            this.chainAnimations([() => this.view.animateSideColumnSwaps()]);
        });

        document.getElementById('swap-rows-z').addEventListener('click', () => {
            this.chainAnimations([() => this.view.animateSideRowSwaps()]);
        });

        document.getElementById('swap-columns-p').addEventListener('click', () => {
            this.chainAnimations([() => this.view.animatePartialColumnSwaps()]);
        });

        document.getElementById('swap-rows-p').addEventListener('click', () => {
            this.chainAnimations([() => this.view.animatePartialRowSwaps()]);
        });

        // Composite action handlers
        document.getElementById('composite-cz').addEventListener('click', () => {
            this.chainAnimations([
                () => this.view.animatePartialColumnSwaps(),
                () => this.view.animatePartialRowSwaps()
            ]);
        });

        document.getElementById('composite-h').addEventListener('click', () => {
            this.chainAnimations([
                () => this.view.animateCenterColumnSwaps(),
                () => this.view.animateCenterRowSwaps()
            ]);
        });

        document.getElementById('composite-nx').addEventListener('click', () => {
            this.chainAnimations([
                () => this.view.animateCenterColumnSwaps(),
                () => this.view.animateSideColumnSwaps(),
                () => this.view.animateCenterColumnSwaps()
            ]);
        });

        document.getElementById('composite-ny').addEventListener('click', () => {
            this.chainAnimations([
                () => this.view.animateCenterRowSwaps(),
                () => this.view.animateSideRowSwaps(),
                () => this.view.animateCenterRowSwaps()
            ]);
        });

        document.getElementById('composite-cx').addEventListener('click', () => {
            this.chainAnimations([
                () => this.view.animateCenterColumnSwaps(),
                () => this.view.animatePartialColumnSwaps(),
                () => this.view.animatePartialRowSwaps(),
                () => this.view.animateCenterColumnSwaps()
            ]);
        });

        // Initialization handlers
        document.getElementById('init-00').addEventListener('click', () => {
            this.view.model.setCellsToOnes([[2, 0], [2, 1], [3, 0], [3, 1]]);
            this.view.createCells();
        });

        document.getElementById('init-01').addEventListener('click', () => {
            this.view.model.setCellsToOnes([[2, 2], [2, 3], [3, 2], [3, 3]]);
            this.view.createCells();
        });

        document.getElementById('init-10').addEventListener('click', () => {
            this.view.model.setCellsToOnes([[0, 0], [0, 1], [1, 0], [1, 1]]);
            this.view.createCells();
        });

        document.getElementById('init-11').addEventListener('click', () => {
            this.view.model.setCellsToOnes([[0, 2], [0, 3], [1, 2], [1, 3]]);
            this.view.createCells();
        });

        // Script execution handler
        document.getElementById('run-script').addEventListener('click', () => {
            this.executeScript();
        });
    }

    async executeScript() {
        const scriptInput = document.getElementById('script-input').value;
        const actions = scriptInput.split(/[\s,;]+/).filter(action => action.trim());
        
        if (actions.length === 0) {
            alert('Please enter at least one action');
            return;
        }

        const invalidActions = actions.filter(action => !this.actionMap[action]);
        if (invalidActions.length > 0) {
            alert(`Invalid actions found: ${invalidActions.join(', ')}`);
            return;
        }

        try {
            this.setButtonsEnabled(false);
            for (const action of actions) {
                await this.actionMap[action]();
            }
        } finally {
            this.setButtonsEnabled(true);
        }
    }

    setButtonsEnabled(enabled) {
        const sidePanel = document.querySelector('.side-panel');
        sidePanel.style.pointerEvents = enabled ? 'auto' : 'none';
        sidePanel.style.cursor = enabled ? 'auto' : 'wait';
    }

    async chainAnimations(animations, pauseDuration = 0.05) {
        try {
            this.setButtonsEnabled(false);
            for (const animation of animations) {
                await animation();
                await new Promise(resolve => setTimeout(resolve, pauseDuration * 1000));
            }
        } finally {
            this.setButtonsEnabled(true);
        }
    }
} 