package main

import "encoding/json"
import "fmt"
import "os"
import "log"
import "io"
import "runtime"
import "github.com/qedus/osmpbf"
// import "time"

func main() {

  f, err := os.Open(os.Args[1])
  if err != nil {
      log.Fatal(err)
  }
  defer f.Close()

  d := osmpbf.NewDecoder(f)
  err = d.Start(runtime.GOMAXPROCS(-1)) // use several goroutines for faster decoding
  if err != nil {
      log.Fatal(err)
  }

  var nc, wc, rc uint64
  for {
      if v, err := d.Decode(); err == io.EOF {
          break
      } else if err != nil {
          log.Fatal(err)
      } else {
          switch v := v.(type) {
          case *osmpbf.Node:
            onNode(v)
            nc++
          case *osmpbf.Way:
            onWay(v)
            wc++
          case *osmpbf.Relation:
            onRelation(v)
            rc++
          default:
            log.Fatalf("unknown type %T\n", v)
          }
      }
  }

  // fmt.Printf("Nodes: %d, Ways: %d, Relations: %d\n", nc, wc, rc)
}

type JsonNode struct {
  Type      string              `json:"type"`
  ID        int64               `json:"id"`
  Lat       float64             `json:"lat"`
  Lon       float64             `json:"lon"`
  Tags      map[string]string   `json:"tags"`
  // Timestamp time.Time           `json:"timestamp"`
}

func onNode(node *osmpbf.Node){
  marshall := JsonNode{ "node", node.ID, node.Lat, node.Lon, node.Tags/*, node.Timestamp*/ }
  json, _ := json.Marshal(marshall)
  fmt.Println(string(json))
}

type JsonWay struct {
  Type      string              `json:"type"`
  ID        int64               `json:"id"`
  Tags      map[string]string   `json:"tags"`
  NodeIDs   []int64             `json:"refs"`
  // Timestamp time.Time           `json:"timestamp"`
}

func onWay(way *osmpbf.Way){
  marshall := JsonWay{ "way", way.ID, way.Tags, way.NodeIDs/*, way.Timestamp*/ }
  json, _ := json.Marshal(marshall)
  fmt.Println(string(json))
}

func onRelation(relation *osmpbf.Relation){
  // do nothing (yet)
}