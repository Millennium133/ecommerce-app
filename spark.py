# PySpark job to process Kafka stream and generate recommendations
from pyspark.sql import SparkSession
from pyspark.sql.functions import explode, split

spark = SparkSession.builder.appName("ProductRecommendation").getOrCreate()

# Read from Kafka
purchase_df = spark \
  .readStream \
  .format("kafka") \
  .option("kafka.bootstrap.servers", "kafka_server:9092") \
  .option("subscribe", "purchase-topic") \
  .load()

# Process data and generate recommendations (simplified)
recommendations = purchase_df \
  .select(explode(split(purchase_df.value, ","))).alias("product")

# Write results to Snowflake
recommendations.write \
  .format("net.snowflake.spark.snowflake") \
  .options(sfOptions) \
  .option("dbtable", "RECOMMENDATIONS") \
  .save()
