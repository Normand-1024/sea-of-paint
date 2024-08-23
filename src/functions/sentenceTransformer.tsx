import {pipeline, env} from "@xenova/transformers";

env.allowLocalModels = false;
const extractor = await pipeline("feature-extraction", "Xenova/all-mpnet-base-v2");

export class SentenceTransformer {

    private dotProduct(vectorA : any, vectorB : any) {
        let prod = 0;
        for (let i = 0; i < vectorA.length; i++) {
          prod += vectorA[i] * vectorB[i];
        }
        return prod;
    }

    private magnitude(vector : any) {
        return Math.sqrt(this.dotProduct(vector, vector));
    }

    cosineSimilarity(vectorA : any, vectorB : any) {
        const dotProd = this.dotProduct(vectorA, vectorB);
        const magnitudeProd = this.magnitude(vectorA) * this.magnitude(vectorB);
        return dotProd / magnitudeProd;
    }
    
    async embed(str : string) {
        return (await extractor(str, {pooling:"mean", normalize:true})).data;
    }
    
}

export default SentenceTransformer;