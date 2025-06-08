import { config } from './config/config.js';
import { MatrixModel } from './models/MatrixModel.js';
import { MatrixView } from './views/MatrixView.js';
import { MatrixController } from './controllers/MatrixController.js';

// Initialize the application
const model = new MatrixModel(config.matrix.size);
const view = new MatrixView(model, document.getElementById('pixi-container'));
const controller = new MatrixController(view); 