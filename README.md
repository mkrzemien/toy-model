# Toy Model Visualization

An interactive visualization of the [Spekkens toy model](https://en.wikipedia.org/wiki/Spekkens_toy_model), demonstrating quantum-like behaviors through a simple 4x4 matrix interface.

## Setup and Running

1. Clone the repository:
```bash
git clone https://github.com/yourusername/toy-model.git
cd toy-model
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

This will open the application in your default browser and enable live reloading.

## Available Actions

The interface provides several groups of operations:

- **Basic Actions**: Defined as permutations of neighbouring columns and rows
- **Composite Actions**: Predefined sequences of basic actions
- **Initialization**: Reset matrix to one of well-defined initial states: 00, 01, 10, 11
- **Script Execution**: Run custom sequences of actions

## References

- [Spekkens Toy Model](https://en.wikipedia.org/wiki/Spekkens_toy_model)
- [Classical realization of the quantum Deutsch algorithm](https://arxiv.org/abs/1903.06655)

## License

MIT License - see [LICENSE](LICENSE) file for details