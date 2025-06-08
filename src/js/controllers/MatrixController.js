export class MatrixController {
    constructor(view) {
        this.view = view;
        this.setupEventListeners();
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