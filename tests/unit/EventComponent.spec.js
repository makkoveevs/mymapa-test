import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import EventComponent from '../../src/components/EventComponent/index.vue';
import { EventItem } from '../../src/common/EventManager';

describe('EventComponent.vue', () => {
  process.env.NODE_ENV === 'test';
  let wrapper = shallowMount(EventComponent);
  it('загрузился и отрендерился без пропсов', () => expect(wrapper.html()).to.include('draggable="true"'));

  const evtdata = new EventItem();
  wrapper = shallowMount(EventComponent, {
    propsData: { evtdata },
  });
  it('загрузился и отрендерился с пропсами', () => expect(wrapper.html()).to.include('draggable="true"'));

  it('нет ошибки в функции editEvent', () => expect(wrapper.vm.editEvent).to.not.throw());
});
