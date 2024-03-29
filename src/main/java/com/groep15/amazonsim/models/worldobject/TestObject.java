package com.groep15.amazonsim.models.worldobject;

import com.groep15.amazonsim.models.World;
import org.json.simple.JSONObject;

public class TestObject extends Object3D {
    public TestObject(World world) {
        super(world);
    }

    @Override
    public JSONObject toJSON() {
        JSONObject json = super.toJSON();
        json.put("texture", "warehouse_shelf");

        return json;
    }

    @Override
    public boolean update() {
        return false;
    }
}
