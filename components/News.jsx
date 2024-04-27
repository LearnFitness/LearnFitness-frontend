import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { openURL } from "expo-linking"

export default function News() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function getArticles() {
      try {
        const res = await axios.get("https://api.bing.microsoft.com/v7.0/news/search?q=fitness&category=health&safeSearch=strict", {
          headers: {
            "Ocp-Apim-Subscription-Key": "4cbffbc91af248b7b88d7de3ba13ca89"
          }
        });
        // console.log(res.data.value[0]);
        setArticles(res.data.value);
      } catch (error) {
        console.log(error);
      }
    }
    getArticles();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness News</Text>
      <ScrollView
        horizontal={true}
        decelerationRate={0}
        snapToAlignment="start"
        snapToInterval={styles.article.width + 2 * styles.article.margin}
      >
        {articles.map((value, index) => {
          return (
            <TouchableOpacity activeOpacity={0.7} key={index} style={[styles.article]} onPress={() => openURL(value.url)}>
              <Image style={styles.articleImage} source={{ uri: value.image.thumbnail.contentUrl }} />
              <Text style={styles.articleName}>{value.name}</Text>
              <Text></Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    marginLeft: "7%",
    color: "white",
    fontSize: 20,
    fontWeight: "500"
  },
  article: {
    backgroundColor: "rgba(255,255,255,1)",
    margin: 10,
    marginLeft: 10,
    borderRadius: 10,
    height: 300,
    width: 250
  },
  articleName: {
    fontSize: 17,
    fontWeight: "500",
    margin: 10
  },
  articleImage: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: "100%",
    height: "60%",
  },
  articleCategory: {

  },
  articleUrl: {

  }
})