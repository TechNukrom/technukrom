

export default class extends React.Component {
  constructor() {
    super();
    this.loadMore = this.loadMore.bind(this);
  }

  loadMore(ev) {
    ev.preventDefault();
    this.props.onLoad();
  }

  componentDidMount() {
    const { onLoad, isLoading, refInitQuery} = this.props;
    this.setState({ isLoading: isLoading });
    if(refInitQuery != undefined)
      refInitQuery.then( (value) => {
        onLoad(value);
      })
  }

  render() {
    const { isLoading, pageEnding } = this.props;
  return <center>{!pageEnding && <a className={`button is-primary ${isLoading ? "is-loading" : ""}`} onClick={this.loadMore}>ดูเพิ่มเติม</a>} </center>
  }
}
