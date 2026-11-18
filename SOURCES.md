# CaloLens Source and License Registry

| Source | Hugging Face or official URL | Intended role | Training/redistribution status | MVP decision |
|---|---|---|---|---|
| USDA FoodData Central | https://fdc.nal.usda.gov/api-guide.html | Nutrition lookup | Government/public-domain API subject to API terms | Approved as a nutrition provider, subject to API terms |
| Open Food Facts label-layout dataset | https://huggingface.co/datasets/openfoodfacts/nutrient-detection-layout | OCR/layout experiments, packaged label reference | Declared CC-BY-SA 3.0; inspect ShareAlike and image/database terms | Experimental; not yet used for commercial model training |
| Food-101 | https://huggingface.co/datasets/food101 | Dish recognition baseline | Academic/research terms; verify official archive | Evaluation only until rights confirmed |
| UECFood-256 | http://foodcam.mobi/dataset256.html | Japanese dish recognition benchmark | Academic/research access | Evaluation only |
| Nutrition5k | https://github.com/google-research/food-dataset-tools/tree/main/nutrition5k | Calorie/macronutrient benchmark | Research/non-commercial terms need verification | Evaluation only |
| mmathys/food-nutrients | https://huggingface.co/datasets/mmathys/food-nutrients | Plate nutrition experiments | Exact upstream/license terms unclear | Do not download or train until verified |
| January/food-vision-v1 | https://huggingface.co/january/food-vision-v1 | Baseline model | Model card and commercial license not verified | Evaluation only |
| January Food Benchmark | https://arxiv.org/abs/2508.09966 | Model benchmark | Public research status unclear | Evaluation only |
| AI4Food-NutritionDB | https://github.com/BiDAlab/AI4Food-NutritionDB | Research reference | Explicit commercial rights not verified | Hold |
| OmniFood8K | https://arxiv.org/abs/2604.12356 | Future benchmark | Data and license availability unclear | Hold |
| FooDD | https://ieee-dataport.org/open-access/foodd-food-detection-dataset-calorie-measurement-using-food-images | Detection/calorie benchmark | CC/attribution claims and underlying rights require review | Hold until official terms are stored |

## Before each source is used

Save the following in a legal review file:

1. Exact source URL.
2. Retrieval date.
3. Dataset/model card license text.
4. Upstream source licenses.
5. Commercial-use determination.
6. Attribution requirements.
7. ShareAlike or derivative requirements.
8. Redistribution restrictions.
9. Training or fine-tuning restrictions.
10. Reviewer and approval date.

No resource marked **Hold** or **Evaluation only** may be included in a production model or commercial release without an explicit approval record.
