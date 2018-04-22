import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState, OpCode } from "../types";
import styled from "./styles";

import SimControls from "./sim-controls";
import Op from "./op";

const IDEDiv = styled.div`
  width: 100%;
`;

const Ops = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: start;
`;

const Filler = styled.div`
  flex-grow: 1;
`;

class IDE extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { showCode } = this.props;
    return (
      <IDEDiv>
        <SimControls />
        {showCode ? this.renderOps() : <p>Code hidden</p>}
      </IDEDiv>
    );
  }

  renderOps(): JSX.Element {
    const { pc, code } = this.props;
    let ops = [];
    for (let addr = 0; addr < this.props.code.length; addr++) {
      const op = code[addr];
      let active = addr == pc;
      ops.push(
        <Op
          key={addr}
          op={op}
          addr={addr}
          active={addr == pc}
          onClick={this.onOpClick}
        />,
      );
    }
    ops.push(<Filler key="filler" />);
    return <Ops>{ops}</Ops>;
  }

  onOpClick = (ev: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = ev;
    const { code } = this.props;
    const addr = currentTarget.dataset.addr;
    const op = code[addr];
    let text = `no op! (addr = ${addr})`;
    if (op) {
      text = JSON.stringify({ addr, op }, null, 2);
    }
    this.props.floaty({ clientX, clientY, text });
  };
}

interface Props {}

const actionCreators = actionCreatorsList("setPage", "floaty");

type DerivedProps = {
  pc: number;
  code: OpCode[];
  showCode: boolean;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(IDE, {
  actionCreators,
  state: (rs: RootState) => ({
    pc: rs.simulation.pc,
    code: rs.simulation.code,
    showCode: rs.ui.showCode,
  }),
});
