/**
 * AI models
 *
 * Types and interfaces for AI and machine learning components.
 */
/**
 * Model type for ingredient detection
 */
export var ModelType;
(function (ModelType) {
    ModelType["TENSORFLOW_JS"] = "TENSORFLOW_JS";
    ModelType["TENSORFLOW_LITE"] = "TENSORFLOW_LITE";
    ModelType["ONNX"] = "ONNX";
})(ModelType || (ModelType = {}));
