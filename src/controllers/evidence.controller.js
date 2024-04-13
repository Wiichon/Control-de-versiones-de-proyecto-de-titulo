import Evidence from "../models/evidence.model.js";
import Task from "../models/task.model.js";

// Buscar una evidencia
export const getEvidence = async (req, res) => {
    try {
        const evidence = await Evidence.findById(req.params.id)
        if (!evidence) return res.status(404).json({ message: 'Evidence not found' })
        res.json(evidence)
    } catch (error) {
        return res.sendStatus(404).json({ message: 'Evidence not found' });
    }
}

// Buscar todas las evidencias
export const getEvidences = async (req, res) => {
    try {
        const evidences = await Evidence.find();
        res.json(evidences);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// Crear una evidencia
export const createEvidence = async (req, res) => {
    try {
        const { title, description, date, origin, quantity, taskId } = req.body;

        if (!taskId) {
            return res.status(400).json({ message: "A valid task ID is required to associate evidence with a task" });
        }

        // Crear una nueva instancia de Evidence
        const newEvidence = new Evidence({
            title,
            description,
            date,
            origin,
            quantity,
            user: req.user.id,
            taskiD: req.body.taskId
        });

        // Guardar la nueva evidencia en la base de datos
        const savedEvidence = await newEvidence.save();

        // Obtener la tarea al que se asociará la evidencia
        const taskToUpdate = await Task.findById(taskId);

        if (!taskToUpdate) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Agregar la ID de la evidencia al array de evidencias de la tarea
        taskToUpdate.evidences.push(savedEvidence._id);

        // Guardar la tarea actualizada en la base de datos
        await taskToUpdate.save();

        console.log("Evidence created and associated with task:", savedEvidence);
        res.json(savedEvidence);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// Actualizar una evidencia
export const updateEvidence = async (req, res) => {
    try {
        const evidence = await Evidence.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
        if (!evidence) return res.status(404).json({ message: 'Evidence not found' })
        res.json(evidence)
    } catch (error) {
        return res.status(404).json({ message: 'Evidence not found' })
    }
}

// Eliminar una evidencia
export const deleteEvidence = async (req, res) => {
    try {
        const evidence = await Evidence.findByIdAndDelete(req.params.id)
        if (!evidence) return res.status(404).json({ message: 'Evidence not found' })
        return res.sendStatus(204);
    } catch (error) {
        return res.status(404).json({ message: 'Evidence not found' })
    }
}




