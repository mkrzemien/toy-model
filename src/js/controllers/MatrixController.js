export class MatrixController {
    constructor(view) {
        this.view = view;
        this.pauseAfterInit = 0.5;
        this.pauseDuration = 0.05;
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
            'CZ0': () => this.chainAnimations([
                () => this.view.animatePartialColumnSwaps(),
                () => this.view.animatePartialRowSwaps()
            ]),
            'CZ1': () => this.chainAnimations([
                () => this.view.animatePartialRowSwaps(),
                () => this.view.animatePartialColumnSwaps()
            ]),
            'CX0': () => this.chainAnimations([
                () => this.view.animateCenterColumnSwaps(),
                () => this.view.animatePartialColumnSwaps(),
                () => this.view.animatePartialRowSwaps(),
                () => this.view.animateCenterColumnSwaps()
            ]),
            'CX1': () => this.chainAnimations([
                () => this.view.animateCenterRowSwaps(),
                () => this.view.animatePartialRowSwaps(),
                () => this.view.animatePartialColumnSwaps(),
                () => this.view.animateCenterRowSwaps()
            ]),
            'HH': () => this.chainAnimations([
                () => this.view.animateCenterColumnSwaps(),
                () => this.view.animateCenterRowSwaps()
            ]),
            // Initialization actions
            '00': () => this.chainAnimations([
                () => {
                    this.view.model.setCellsToOnes([[2, 0], [2, 1], [3, 0], [3, 1]]);
                    this.view.createCells();
                    return Promise.resolve();
                }
            ], this.pauseAfterInit),
            '01': () => this.chainAnimations([
                () => {
                    this.view.model.setCellsToOnes([[2, 2], [2, 3], [3, 2], [3, 3]]);
                    this.view.createCells();
                    return Promise.resolve();
                }
            ], this.pauseAfterInit),
            '10': () => this.chainAnimations([
                () => {
                    this.view.model.setCellsToOnes([[0, 0], [0, 1], [1, 0], [1, 1]]);
                    this.view.createCells();
                    return Promise.resolve();
                }
            ], this.pauseAfterInit),
            '11': () => this.chainAnimations([
                () => {
                    this.view.model.setCellsToOnes([[0, 2], [0, 3], [1, 2], [1, 3]]);
                    this.view.createCells();
                    return Promise.resolve();
                }
            ], this.pauseAfterInit)
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Basic action handlers
        document.getElementById('swap-columns-h').addEventListener('click', () => this.actionMap['H0']());
        document.getElementById('swap-rows-h').addEventListener('click', () => this.actionMap['H1']());
        document.getElementById('swap-columns-z').addEventListener('click', () => this.actionMap['Z0']());
        document.getElementById('swap-rows-z').addEventListener('click', () => this.actionMap['Z1']());
        document.getElementById('swap-columns-p').addEventListener('click', () => this.actionMap['P0']());
        document.getElementById('swap-rows-p').addEventListener('click', () => this.actionMap['P1']());

        // Composite action handlers
        document.getElementById('composite-columns-x').addEventListener('click', () => this.actionMap['X0']());
        document.getElementById('composite-rows-x').addEventListener('click', () => this.actionMap['X1']());
        document.getElementById('composite-columns-cx').addEventListener('click', () => this.actionMap['CX0']());
        document.getElementById('composite-rows-cx').addEventListener('click', () => this.actionMap['CX1']());
        document.getElementById('composite-columns-cz').addEventListener('click', () => this.actionMap['CZ0']());
        document.getElementById('composite-rows-cz').addEventListener('click', () => this.actionMap['CZ1']());
        document.getElementById('composite-h').addEventListener('click', () => this.actionMap['HH']());

        // Initialization handlers
        document.getElementById('init-00').addEventListener('click', () => this.actionMap['00']());
        document.getElementById('init-01').addEventListener('click', () => this.actionMap['01']());
        document.getElementById('init-10').addEventListener('click', () => this.actionMap['10']());
        document.getElementById('init-11').addEventListener('click', () => this.actionMap['11']());

        // Script execution handler
        document.getElementById('run-script').addEventListener('click', () => {
            this.executeScript();
        });
    }

    async executeScript() {
        const scriptInputElem = document.getElementById('script-input');
        const scriptInput = scriptInputElem.value;
        const actions = this.parseActions(scriptInput);
        
        if (!this.validateActions(actions, scriptInputElem)) {
            return;
        }

        try {
            this.setButtonsEnabled(false);
            await this.executeActions(actions, scriptInputElem);
        } finally {
            this.setButtonsEnabled(true);
            this.clearHighlightedAction(scriptInputElem);
        }
    }

    parseActions(scriptInput) {
        return scriptInput.split(/[\s,;]+/).filter(action => action.trim());
    }

    validateActions(actions, scriptInputElem) {
        const validationMessage = document.getElementById('validation-message');
        
        if (actions.length === 0) {
            this.showValidationError('Enter at least one action', scriptInputElem, validationMessage);
            return false;
        }

        const invalidActions = actions.filter(action => !this.actionMap[action]);
        if (invalidActions.length > 0) {
            this.showValidationError(`Invalid actions: ${invalidActions.join(', ')}`, scriptInputElem, validationMessage);
            return false;
        }

        this.clearValidationError(scriptInputElem, validationMessage);
        return true;
    }

    showValidationError(message, scriptInputElem, validationMessage) {
        validationMessage.textContent = message;
        validationMessage.classList.add('show');
        scriptInputElem.classList.add('error');
    }

    clearValidationError(scriptInputElem, validationMessage) {
        validationMessage.classList.remove('show');
        scriptInputElem.classList.remove('error');
    }

    async executeActions(actions, scriptInputElem) {
        let currentPosition = 0;
        for (const action of actions) {
            currentPosition = this.highlightCurrentAction(action, scriptInputElem, currentPosition);
            await this.actionMap[action]();
        }
    }

    highlightCurrentAction(action, scriptInputElem, startPosition) {
        const actionIndex = scriptInputElem.value.indexOf(action, startPosition);
        if (actionIndex !== -1) {
            scriptInputElem.setSelectionRange(actionIndex, actionIndex + action.length);
            scriptInputElem.focus();
            return actionIndex + action.length;
        }
        return startPosition;
    }

    clearHighlightedAction(scriptInputElem) {
        scriptInputElem.setSelectionRange(0, 0);
    }

    setButtonsEnabled(enabled) {
        const sidePanel = document.querySelector('.side-panel');
        sidePanel.style.pointerEvents = enabled ? 'auto' : 'none';
        sidePanel.style.cursor = enabled ? 'auto' : 'wait';
    }

    async chainAnimations(animations) {
        try {
            this.setButtonsEnabled(false);
            for (const animation of animations) {
                await animation();
                await new Promise(resolve => setTimeout(resolve, this.pauseDuration * 1000));
            }
        } finally {
            this.setButtonsEnabled(true);
        }
    }
} 