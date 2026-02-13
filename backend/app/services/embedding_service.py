from sentence_transformers import SentenceTransformer
from ..core.config import settings
import numpy as np

class EmbeddingService:
    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            # Initialize the 384-dimensional model locally
            cls._model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
        return cls._model

    @staticmethod
    def generate_embedding(text: str) -> list:
        """
        Generates a 384-dimensional vector for the given text.
        Calculated locally on the server for zero cost.
        """
        model = EmbeddingService.get_model()
        embedding = model.encode(text)
        return embedding.tolist()
